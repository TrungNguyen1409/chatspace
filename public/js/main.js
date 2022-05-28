// Code for client
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// event listener for the submition of the form (msg submit)

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    //extract text message 
    const msg = e.target.elements.msg.value; // user input in the UI

    // emit message to server
    socket.emit('chatMessage', msg);

    //Clear input after submit
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();


});

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


