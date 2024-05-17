var express = require('express')
var router = express()
var controller = require('../controller/UploadController.js')


router.post('/login', controller.login)
router.post('/formUpload', (req, res) => controller.uploadForm(req, res))

// router.get('/', (req, res) => {
//     res.sendFile(__dirname + 'public/index.html')
// })

router.get('/', (req, res) => {
    res.render('form.ejs')
})


router.get('/login', (req, res) => {
    res.render('login.ejs')
})
module.exports = router

