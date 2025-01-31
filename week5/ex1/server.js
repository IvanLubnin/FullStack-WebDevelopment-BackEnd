require('dotenv').config(); // Load evironment variables
const express = require('express');
const morgan = require('morgan');
const https = require('https'); // Импорт модуля HTTPS
const WebSocket = require('ws');
const selfsigned = require('selfsigned');// you can generate your sertificates for enabling https in your app
const connectToDatabase = require('./config/db');
const moviesRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const pems = selfsigned.generate(null, { days: 365 });
const privateKey = pems.private; // Исправленный доступ к ключу
const certificate = pems.cert; // Исправленный доступ к сертификату

//our task: change the server, so it uses https instead of http
//encryption needs certificates and signing but on the dev phase we can use self-signing to generate cetificates


//we ll need http server - required for integrating WebSocket with express
const http = require('http');
const {initializeWebSocket} = require('./wsConnections.js');

const app = express();
const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;


//checking certificates before starting up server
if (!privateKey || !certificate)
{
    console.error("Error: no sertificates generated");
    process.exit(1); //stop the process, if keys are not generated
}
else
{
    console.log("Sertificates loaded succesfully");
    console.log("Private Key:", privateKey.substring(0, 30) + "...");
    console.log("Certificate:", certificate.substring(0, 30) + "...");
    const server = https.createServer({ key: privateKey, cert: certificate }, app);
}

//we need a http server for the websocket
const server = https.createServer({key: privateKey, cert: certificate}, app);

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
app.use('/auth', authRoutes);

//start the server
const startServer = async() =>
{
    //connect the database, then star listening in port
    await connectToDatabase();
    server.listen(https_port, () =>
    {
        console.log("Server running on port 3443");
    });
};

//initializwe the websocket and start CRUD server
initializeWebSocket( server );

startServer();

// catch-all route for undefined routes
app.use((req, res) =>
{
    res.status(404).send('404 Not Found: The requested resource does not exist.');
});

