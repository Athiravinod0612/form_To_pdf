const puppeteer = require('puppeteer')
const User = require('../Model/upload.js');
const uploadHelper = require('../Helper/uploadHelper.js')
const passwordHash = require('../Helper/password.js')
// user login 
// const login = async (req, res) => {

//     try {

//         const existUser = await User.findOne({ email: req.body.email })
//         if (!existUser) {
//             res.send("user doest exist")
//         } else {
//             // res.send("login sucsessfully")
//             const isMatch = await passwordHash.passwordIsMatch({ plainPassword: req.body.password, hashedPassword: existUser.password })
//             console.log(isMatch)
//             if (isMatch === false) {
//                 res.send("password error")
//             } else {
//                 res.send("successfully login")
//             }


//         }
//     } catch (err) {
//         res.status(500).send(err)
//     }
// }



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).send("User doesn't exist");
        }

        const isMatch = await passwordHash.comparePassword(password, existUser.password);
        if (!isMatch) {
            return res.status(401).send("Password error");
        }

        res.send("Successfully logged in");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const uploadForm = (req, res) => {
    uploadHelper.upload(req, res, async (err) => {
        if (err) {
            res.send(err);

        } else {
            if (req.file == undefined) {
                res.send('No file selected!');

            } else {
                const bcryptPassword = await passwordHash.bcryptPassword(req.body.password)

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcryptPassword,
                    photo: req.file.filename
                });
                await newUser.save();

                // Generate PDF
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(`
                         <h1>User Info</h1>
                         <p>name: ${newUser.name}</p>
                         <p>Email: ${newUser.email}</p>
                         <a href=${newUser.photo}></a>
                         <img src="http://localhost:3000/uploads/${newUser.photo}" width="200">
                    `);
                await page.pdf({ path: `public/pdfs/${newUser.name}.pdf`, format: 'A4' });
                await browser.close();
                // return (`File uploaded and PDF generated:
                //             <a href="/pdfs/${newUser.name}.pdf">Download PDF</a>
                res.send(newUser)
                // `);
            }
        }
    });
}

module.exports = { login, uploadForm }
