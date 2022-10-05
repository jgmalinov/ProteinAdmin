const express = require('express');
const app = express();
const { pool } = require("./DB/dbConfig");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin');
    next();
});

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', async (req, res, next) => {
    let {name, email, password, confirmPassword, weight, weightSystem, height, heightSystem, activityLevel} = req.body;
    console.log(req.body);

    let errors = {errors: []};
    if (!name || !email || !password || !confirmPassword || !weight || !weightSystem || !height || !heightSystem || !activityLevel) {
        errors.errors.push({message: "Please enter all fields"})
    };

    if (password.length < 6) {
        errors.errors.push( {message: "Password should be at least 6 characters"} )
    };

    if (password !== confirmPassword) {
        errors.errors.push({message: "Passwords do not match"})
    };
    
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if (err) {
            throw err;
        } else {
            if (results.rows.length > 0) {
                errors.errors.push({message: 'User with this email already exists'});
            };
            if (errors.errors.length > 0) {
                res.send(errors);
                return;
            };
        };
    });

        const saltRounds = 10;
        bcrypt.hash(password, 10, function(err, hash) {
            console.log(hash);
        });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})