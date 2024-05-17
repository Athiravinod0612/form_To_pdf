const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fileUploadApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const UserSchema = new mongoose.Schema({ username: String, email: String, photo: String });
const User = mongoose.model('User', UserSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// Set up storage engine for multer
const storage = multer.diskStorage({ destination: './public/uploads/', filename: (req, file, cb) => { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); } });
// Init uploadconst upload = multer({    storage: storage,    limits: { fileSize: 1000000 },    fileFilter: (req, file, cb) => {        checkFileType(file, cb);    }}).single('photo');
// Check file typefunction 
checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) { return cb(null, true); } else { cb('Error: Images Only!'); }
}
// Routesapp.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) { res.send(err); } else {
            if (req.file == undefined) { res.send('No file selected!'); } else {
                const newUser = new User({ username: req.body.username, email: req.body.email, photo: req.file.filename });
                await newUser.save();
                // Generate PDF                const browser = await puppeteer.launch();                const page = await browser.newPage();                await page.setContent(`                    <h1>User Info</h1>                    <p>Username: ${newUser.username}</p>                    <p>Email: ${newUser.email}</p>                    <img src="http://localhost:3000/uploads/${newUser.photo}" width="200" />                `);                await page.pdf({ path: `public/pdfs/${newUser.username}.pdf`, format: 'A4' });
                await browser.close();
                res.send(`File uploaded and PDF generated: <a href="/pdfs/${newUser.username}.pdf">Download PDF</a>`);
            }
        }
    });
});
// Start serverapp.listen(3000, () => console.log('Server started on http://localhost:3000'));