const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// login logic
const login = async (req, res) =>
{
    const { username, password } = req.body;
    try
    {
        // check if user does exists
        const user = await User.findOne({ username });
        if (!user)
        {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // validate password
        if (user.password !== password)
        {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // token validity
        );
        console.log("Moro")
        res.json({ token });
    }
    catch (error)
    {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { login };