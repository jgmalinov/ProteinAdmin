const express = require('express');
const app = express();
const { pool } = require("./DB/dbConfig");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const initialize = require('./PassportConfig');

initialize(passport);

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin');
    next();
});

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', async (req, res, next) => {
    let errorsSent = false;
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
                errorsSent = true;
                return;
            };
        };
    });
    if (errorsSent) {
        return;
    };
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log(hash);
        pool.query(`INSERT INTO users (name, email, password, weight, weightsystem, height, heightsystem, activitylevel)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [name, email, hash, weight, weightSystem, height, heightSystem, activityLevel], (err, result) => {
                        if (err) {
                            console.log(err.message);
                        } else {
                            res.status(200).send({message: 'Successfully registered!'});
                        }
                    })
    });
});

app.post('/login', passport.authenticate('local', {failureMessage: true}, (err, res) => {console.log(err, res)}), (req, res, options) => {
    console.log(options);
    console.log(req.isAuthenticated());
    const returnObj = {
        user: req.user,
    }
    res.status(200).send(req.user);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})