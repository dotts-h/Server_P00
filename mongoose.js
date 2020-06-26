const mongoose = require('mongoose')
const { ObjectID } = require('bson')

mongoose.connect('mongodb://127.0.0.1:27017/pcy-app-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const User = mongoose.model('User', {
    username: {
        type: String,
        require: true
    },
    fullName: {
        type: String
    },
    password: {
        type: String,
        require: true
    }
})

const addUser = (user) => {
    var query = User.where({
        username: user.username
    })

    var result = query.findOne()

    const _user = new User(user)
    return _user.save()
}

const authenticateUser = (user) => {
    var query = User.where({
        username: user.username,
        password: user.password
    })

    return query.findOne()
}

const checkIfExists = (user) => {
    var query = User.where({
        username: user.username
    })

    return query.findOne()
}

const getFullUser = (user) => {
    var query = User.where({
        _id: new ObjectID(user._id)
    })

    return query.findOne()
}

// addUser({
//     username: 'dotts',
//     fullName: 'Horia',
//     password: 'pwd123'
// }).then((result) => {
//     console.log(result)
// })


module.exports.addUser = addUser
module.exports.authenticateUser = authenticateUser
module.exports.checkIfExists = checkIfExists
module.exports.getFullUser = getFullUser