const socket = io()
const $chatBody = document.querySelector(".chat-body")
const $messages = document.querySelector(".messages")
$msgInput = document.querySelector("#msgInput")
const $currentUser = document.querySelector(".currentUser")
const $room = document.querySelector(".room")
const $joinRoom = document.querySelector("#join")

$chatBody.scrollTop = $chatBody.scrollHeight
socket.on("welcome", (data) => {
    const newIncomingMessage = document.createElement("div")
    newIncomingMessage.setAttribute("class", "info")
    newIncomingMessage.innerHTML = data
    $messages.appendChild(newIncomingMessage)
    $chatBody.scrollTop = $chatBody.scrollHeight
})

socket.emit("join", { user: $currentUser.innerText, room: $room.innerText }, () => {
    console.log("Successfull");
})


socket.on("infoMsg", (data) => {
    const newIncomingMessage = document.createElement("div")
    newIncomingMessage.setAttribute("class", "info")
    newIncomingMessage.innerHTML = data
    $messages.appendChild(newIncomingMessage)
    $chatBody.scrollTop = $chatBody.scrollHeight
})

socket.on("incoming message", (data) => {
    const newIncomingMessage = document.createElement("div")
    newIncomingMessage.setAttribute("class", "incoming")
    let elem = `<div class="msgBy">${data.user}</div><p>${data.msg}</p><span class="text-muted"><small>${moment(data.time).format("h:mm a")}</small></span>`
    newIncomingMessage.innerHTML = elem
    $messages.appendChild(newIncomingMessage)
    $chatBody.scrollTop = $chatBody.scrollHeight
})

document.querySelector("#chat").addEventListener("submit", (e) => {
    e.preventDefault()
    const msg = $msgInput.value
    const dt = new Date().getTime()
    socket.emit("send message", { msg, room: $room.innerText, user: $currentUser.innerText , time:dt}, () => {
        const newOutgoingMessage = document.createElement("div")
        newOutgoingMessage.setAttribute("class", "outgoing")
        let elem = `<p>${msg}</p><span class="text-muted"><small>${moment(dt).format("h:mm a")}</small></span>`
        newOutgoingMessage.innerHTML = elem
        $messages.appendChild(newOutgoingMessage)
        $msgInput.value = ''
        $msgInput.focus()
        $chatBody.scrollTop = $chatBody.scrollHeight
    })
})