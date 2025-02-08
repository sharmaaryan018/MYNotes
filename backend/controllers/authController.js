const bcrypt = require('bcryptjs');
const User = require('../models/User');
const College = require('../models/College');
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    console.log(req.body); // Log the received data

  const { firstName, lastName, email, password, role, college } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the College by name or create a new one if it doesn't exist
    let collegeDoc = await College.findOne({ name: college });
    
    if (!collegeDoc) {
      // If the college doesn't exist, create a new one
      collegeDoc = new College({ name: college });
      await collegeDoc.save();
      console.log(`New college created: ${college}`);
    }

    // Create the user with the College ObjectId
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      college: collegeDoc._id,
      department:"",
      year:"",
      
       // Use the ObjectId of the college
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully',user });
  } catch (err) {
    console.error(err); // Log the error to the console for debugging
    res.status(500).json({ message: 'Server error/ Unable to register', error: err.message || err });
  }
};

// Login controller for authenticating users
const login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Hardcoded admin credentials
    const adminEmail = "admin@example.com";
    const adminPassword = "admin@123"; // Store secure passwords in environment variables in production

    // Check if the credentials are for admin
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { email: adminEmail, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: {
          email: adminEmail,
          role: "admin",
        },
        message: `Admin Login Success`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us. Please Sign Up to Continue`,
      });
    }

    // Generate JWT token and compare password for non-admin users
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Save token to user document in database
      user.token = token;
      console.log("Token saved to DB:", token);
      user.password = undefined;

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure. Please Try Again`,
    });
  }
};

  

module.exports = {
  signup,
  login,
};
