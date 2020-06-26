var net = require('net')
// var db = require('./mongoose')
const {addUser, authenticateUser, checkIfExists, getFullUser} = require('./mongoose.js')
const { connect } = require('http2')

const connectedUsers = []
class ConnectedUsers{
    constructor() {}

    static #connectedUsers = []
    static #globalChat = []

    static addUser(user) {
        this.#connectedUsers.push(user);
    }

    static removeUser(user) {
        const index = this.#connectedUsers.indexOf(user)
        this.#connectedUsers.splice(index, 1)
    }

    static getArrayOfConnectedUsers() {
        return this.#connectedUsers;
    }

    static addMsg(msg) {
        this.#globalChat.push(msg)
    }
}

var server = net.createServer((socket) => {
    console.log(`Connection received from: ${socket.remoteAddress} port: ${socket.remotePort}`)
    socket.setKeepAlive(true)
    socket.on('data', (buffer) => {
        var object = {}
        var isOK = false

        try {
            object = JSON.parse(buffer)
            isOK = true
        } catch (err) {
            console.error(err)
        }

        console.log(object)

        // LogIn Process
        if (object.action === 'logIn') {
            console.log('LogIn Initiated')

            authenticateUser(object)
            .then((result) => {
                if (result !== null) {
                    console.log(result)

                    socket.write(JSON.stringify({
                        action: 'authenticated',
                        _id: result._id,
                        username: result.username,
                        fullName: result.fullName,
                        password: null
                    }))
                } else {
                    console.log(result)

                    socket.write(JSON.stringify({
                        action: 'auth_failed'
                    }))
                }
            })

        // Register Process
        } else if (object.action === 'register') {
            console.log('Register Initiated')

            checkIfExists(object)
            .then((result) => {
                if (result === null) {
                    console.log(result)

                    addUser(object)
                    .then((result) => {
                        socket.write(JSON.stringify({
                            action: 'registered',
                            _id: result._id,
                            username: result.username,
                            fullName: result.fullName,
                            password: null
                        }))
                    })
                } else {
                    console.log(result)

                    socket.write(JSON.stringify({
                        action: 'registration_failed'
                    }))
                }
            }) 
        } else if (object.action === 'connected') {
            console.log('Connected Initated')
            getFullUser(object)
            .then((result) => {
                console.log(result)

                // connectedUsers = connectedUsers.filter((el) => {
                //     return (el.username !== result.username)
                // })
                // console.log(connectedUsers)
                // connectedUsers.push({
                //     _id: result._id,
                //     username: result.username,
                //     connection: socket,
                //     address: socket.remoteAddress,
                //     port: socket.remotePort
                // })
                // console.log(connectedUsers)
                ConnectedUsers.addUser({
                        _id: result._id,
                        username: result.username,
                        connection: socket,
                        address: socket.remoteAddress,
                        port: socket.remotePort,
                        isConnected: true
                })
                console.log(ConnectedUsers.getArrayOfConnectedUsers())

                socket.write(JSON.stringify({
                    action: 'authenticated',
                    _id: result._id,
                    username: result.username,
                    fullName: result.fullName,
                    password: null,
                }))
            })
        } else if (object.action === 'getConnectedUsers') {
            console.log('getConnectedUsers Initiated')
            
            socket.write(JSON.stringify(ConnectedUsers.getArrayOfConnectedUsers()))
            
        } else if (object.action === 'disconnected') {
            console.log('disconnected Initiated')

            ConnectedUsers.removeUser(object)
            console.log(`User disconnected: ${object.username}`)
            console.log('Connected: ')
            ConnectedUsers.getArrayOfConnectedUsers().forEach((el) => {
                console.log(el.username)
            })
        }
    }).on('close', () => {
        console.log(`Connection from: ${socket.remoteAddress} ended`)

        // ConnectedUsers.getArrayOfConnectedUsers().forEach((el) => {
        //     if(el.isConnected) {
        //         ConnectedUsers.removeUser(el)
        //         console.log(`removed user: ${el.username}`)
        //     }
        // })
        
        // console.log('Connected: ')
        // ConnectedUsers.getArrayOfConnectedUsers().forEach((el) => {
        //     console.log(el.username)
        // })
    })
})

server.listen(3000)