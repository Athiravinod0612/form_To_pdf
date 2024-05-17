const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    PhoneNumber: Number,
    password: String,
    photo: String
})






module.exports = mongoose.model("User", userSchema)