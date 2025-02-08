//const Note = require('../models/note');
// const User = require('../models/userModel');
// const College = require('../models/collegeModel');

// Create a new note
const welcome = async (req, res) => {
    const {email, id, role} = req.user;
res.json({
    message: 'Welcome to the home page',
    user: {
        email,
        id,
        role
    }
})
};

module.exports = {
    welcome
};
