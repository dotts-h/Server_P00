const {MongoClient, ObjectID, Db} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'pcy-app'


const addUser = (user) => {
    return MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log('Unable to connect to database')
            return console.log(error)
        }
    
        console.log('Connected Successfully!')

        const db = client.db(databaseName)

        return db.collection('users').insertOne(user)
    })
}

const removeUser = (user) => {
    MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log('Unable to connect to database')
            return console.log(error)
        }
    
        console.log('Connected Successfully!')

        const db = client.db(databaseName)

        const user2 = db.collection('users')
        .deleteOne(user)
        .then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })

        db.collection('users')
    })
}

const findUser = (user) => {
    MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log('Unable to connect to database')
            return console.log(error)
        }
    
        console.log('Connected Successfully!')

        const db = client.db(databaseName)

        const user2 = db.collection('users')
        .findOne(user)
        .then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })

        db.collection('users')
    })
}

addUser({
    username: 'dott',
    fullName: 'Horia',
    password: 'pwd123'
})
// removeUser({
//     username: 'dott',
//     fullName: 'Horia',
//     password: 'pwd123'
// })

module.exports = addUser
module.exports = removeUser
module.exports = findUser