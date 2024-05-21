const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase(),
    room = room.trim().toLowerCase();

    // validate user 
    if (!username || !room) {
        return {
            Error: 'Username and room is required'
        }
    }

    // check for existing user 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Existing username
    if (existingUser) {
        return {
            Error: "Username already taken..!"
        }
    }

    // Add users
    const user = { id, username, room };
    users.push(user)
    return { user }
}

// Remove the users
const removeUser = (id) => {
    const userId = users.findIndex((user) => user.id === id);

    if (userId !== -1) {
        return users.splice(userId, 1)[0]
    }
}

// Get Users
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// GetUserInRoom
const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}

module.exports = {addUser, removeUser, getUser, getUserInRoom}



// addUser({
//     id: 1,
//     username: 'Raj',
//     room: 'Surat'
// })

// addUser({
//     id: 2,
//     username: 'Raju',
//     room: 'Center City'
// })

// addUser({
//     id: 3,
//     username: 'Jay',
//     room: 'Surat'
// })

// const user = getUser(3);
// // console.log(user);

// const userList = getUserInRoom('')
// console.log(userList);


// // const removeUsers = removeUser(1);
// // console.log(removeUsers);
// // console.log(users);