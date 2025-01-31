const { WebSocket } = require('ws'); //WebSocketLibrary

//store the connections here. Add when there is a new client, delete when client disconects
const connectedClients = new Set();

const initializeWebSocket = (server) =>
{
    //start and initialize the ws server here and handle new connections and disconnections
    const wss = new WebSocket.Server({server});

    // handle client connections
    wss.on('connection',(ws)=>
    {
        console.log('WebSocket connection established');
        //we want to keep the client connection in a structure so add the client to the set
        connectedClients.add(ws);
        //send welcome to the client
        ws.send("welcome to the family son (RE7 reference)");

        //handle icoming messages
        ws.on('message',(message) =>
        {
            //send this message from one client to everyone connected including the sending party(echo) (for the whole set)
            console.log('Message receiveed from a client so send it to everyone');
            connectedClients.forEach((client) =>
            {
                if(client.readyState === WebSocket.OPEN)
                {
                    client.send(message);
                }
            })
        })

        //handled disconnetcts(remove from set)
        ws.on('close', () =>
        {
            console.log('WebSocket client connetion closed');
            connectedClients.delete(ws);
        });

        //handle possible errors
        ws.on('error', (error) =>
        {
            console.log('WebSocket Error: ', error);
        });
    })
}

//export to server.js
module.exports = {initializeWebSocket};