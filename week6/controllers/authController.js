const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

// login logic
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token validity
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Check if the username is already taken
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        // Create a new user with the hashed password
        const user = new User({ username, password: hashedPassword, role });
        await user.save();  // Save the new user to the database

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { login, register };
