const socket = io();

// Elements
const $messageFrom = document.querySelector('#message-form');
const $messageFromInput = $messageFrom.querySelector('input');
const $messageFromButton = $messageFrom.querySelector('button');
const $locationButton = document.querySelector('#location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplates = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#loaction-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    // New Message Element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:m a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

$messageFrom.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable
    $messageFromButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        // enable
        $messageFromButton.removeAttribute('disabled');
        $messageFromInput.value = '';
        $messageFromInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message was delivered..!');
    });
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Navigator geolocation is not support in your browser')
    }
    // disabled button
    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled');
            console.log('Location shared successfully...!');
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
})




// ****************************************************************************************
// server to client
// socket.on('countUpdated', (count)=>{
//     console.log('Count Updated....', count);
// })

// // client-side  // client to server
// document.querySelector('#increase').addEventListener('click', ()=>{
//     console.log("Button is clicked");
//     socket.emit('increment');
// })
