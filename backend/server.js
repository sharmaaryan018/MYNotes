require('dotenv').config()
const express = require('express');
const connectToDB = require("./db")
const cookieParser = require('cookie-parser');
const  cloudinaryConfig  = require('./config/cloudinaryConfig');

const noteRoutes = require('./routes/noteRoutes')
const authRoutes = require('./routes/authRoutes')
const homeRoutes = require('./routes/homeRoutes')
const adminRoutes = require('./routes/adminRoutes')
const alumniRoutes = require('./routes/alumniRoutes')
const bookmarkRoutes = require("./routes/bookmarkRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

connectToDB();

//middleware -> express.json
app.use(express.json());
// Use cookie-parser middleware
app.use(cookieParser());
const cors = require('cors');



// Enable CORS for all origins
app.use(cors({
      origin: 'http://localhost:3000', // React app running on port 5173
    credentials: true,
  }));
  


app.use('/api/auth', authRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/bookmarks', bookmarkRoutes);




app.listen(PORT,()=> {
    console.log(`Server is now running on ${PORT}`);
    cloudinaryConfig();

});



