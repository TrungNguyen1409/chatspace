// entry point to everything: backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connect
io.on('connection',socket =>{
    console.log('New WS Connection...');

    //Welcome new user
    socket.emit('message','Welcome to ChatSpace!'); // emits to a single client

    //Broadcast when a user connects. Broadcast to all clients except the one who just connected
    socket.broadcast.emit('message', 'An user has joined the chat');

    // io.emit();  -> to everyone
    // runs when client disconnects
    socket.on('disconnect', () =>{
        io.emit('message','An user has left the chat');
    });

    // listen for chatMessage

    socket.on('chatMessage', msg =>{
        console.log(msg);
        io.emit('message', msg);
    });
});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));