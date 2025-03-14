const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {AppoinmentManagerModel} = require('../../models/appointment_manager');

module.exports.login = async (req, res) => {
    const { email_username, password } = req.body;
    try {
        // Check if staff exists
        const staff = await AppoinmentManagerModel.findOne({$or:[{ email: email_username }, { mobile: email_username }]});
        if (!staff) {
            return res.status(404).json({status:false, message: 'Staff not found', desc: 'The email or number provided does not match any staff in our records.' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({status:false, message: 'Invalid credentials', desc: 'The password provided is incorrect.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: staff._id, role: staff.role },
            process.env.SECRET_KEY
        );
        res.json({status:true, token, message: 'Login successful', desc: 'You have successfully logged in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status:false,message: 'Server error', desc: 'An error occurred on the server. Please try again later.' });
    }
};

