// entry point to everything: backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatSpace Bot';

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connect
io.on('connection',socket =>{

    socket.on('joinRoom', ({username,room})=>{


        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        console.log({username,room}.username);
        //Welcome new user
        socket.emit('message', formatMessage(botName, `Welcome ${username} to ${room}`));    // emits to a single client
    
        //Broadcast when a user connects. Broadcast to all clients except the one who just connected
        socket.broadcast
            .to(user.room) // broadcast to a specific room
            .emit('message', formatMessage(botName,`${username} has joined the chat`));

        // Send users and room info    
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    

    // io.emit();  -> to everyone
   

    // listen for chatMessage

    socket.on('chatMessage', msg =>{

        const user = getCurrentUser(socket.id);
        console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

     // runs when client disconnects
     socket.on('disconnect', () =>{

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`));
        }

        // Send users and room info    
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        
    });
});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// one big question: how to differentiate between different rooms