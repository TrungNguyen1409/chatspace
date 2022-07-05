const users = []; //  can link a database but here only save in memory

// Join user to chat 
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}


//get current user
function getCurrentUser(id){
    return users.find(user=>user.id === id);
}

//user left the chat

function userLeave(id){

    const index = users.findIndex(user=>user.id===id);
    // why -1? find it, return it. if not find, return -1 
    if(index !== -1){
        return users.splice(index, 1)[0]; // instead of returning the whole array, only the user
    }
}

// get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};