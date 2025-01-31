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
        // validate password
        if (user.password !== password)
        {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        // generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // token validity
        );
        res.json({ token });
    }
    catch (error)
    {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async(req, res) =>
{
    //create a POST API for registering new user
    //expect username, password and role in the requested body
    const {username, password, role} = req.body;
    try
    {
        //checkif the username is taken (check from MongoDB)
        const userExists = await User.findOne({ username });
        if ( userExists )
        {
            return res.status(400).json({error: 'Username is already exists'})
        }
        //create a new user to the DB
        const user = new User ({username, password, role});
        await user.save(); //save it to the database
        res.status(201).json({message: 'User registered successfully'})
    }
    catch(error)
    {
        res.status(500).json({error: 'Internal sever error'})
    }
}

module.exports = { login, register};