var express = require('express')
var app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/fileToPdf")
const path = require('path')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


var formRoute = require('./Routes/formRoute.js')
app.use('/', formRoute)

app.listen(3000, (req, res) => {
    console.log("Server running port 3000")
})

