// entry point to everything: backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatSpace Bot';

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connect
io.on('connection',socket =>{

    socket.on('joinRoom', ({username,room})=>{
        console.log('New WS Connection...');
        console.log({username,room}.username);
        //Welcome new user
        socket.emit('message', formatMessage(botName, `Welcome ${username} to ${room}`));    // emits to a single client
    
        //Broadcast when a user connects. Broadcast to all clients except the one who just connected
        socket.broadcast.emit('message', formatMessage(botName,`${username} has joined the chat`));
    });

    

    // io.emit();  -> to everyone
   

    // listen for chatMessage

    socket.on('chatMessage', msg =>{
        console.log(msg);
        io.emit('message', formatMessage('USER',msg));
    });

     // runs when client disconnects
     socket.on('disconnect', () =>{
        io.emit('message','An user has joined the chat');
    });
});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));