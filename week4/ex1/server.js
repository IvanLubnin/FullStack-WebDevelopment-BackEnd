require('dotenv').config(); // Load evironment variables
const express = require('express');
const morgan = require('morgan');
const connectToDatabase = require('./config/db');
const moviesRoutes = require('./routes/movies');

const app = express();
const port = 3004;

//middleware
app.use(morgan('dev'));
app.use(express.json());

//general route
app.get('/', (req, res) =>
{
    res.send("You are in Movie management system")
});

//routes for the whole app

app.use('/movies', moviesRoutes);

//start the server
const startServer = async() =>
{
    //connect the database, then star listening in port
    await connectToDatabase();
    app.listen(port, () =>
    {
        console.log("Server running on port 3004");
    });
};

startServer();

// catch-all route for undefined routes
app.use((req, res) =>
{
    res.status(404).send('404 Not Found: The requested resource does not exist.');
});

