const express = require('express');
const app = express();
const { pool } = require("./DB/dbConfig");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const initialize = require('./PassportConfig');
const cors = require('cors');
const e = require('cors');

initialize(passport);

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    /* cookie: {maxAge: 1000 * 60 * 60 * 24} */
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', async (req, res, next) => {
    let errorsSent = false;
    let {name, email, password, confirmPassword, weight, weightSystem, height, heightSystem, gender, activityLevel, DOB, goal} = req.body;
    console.log(req.body);

    let errors = {errors: []};
    if (!name || !email || !password || !confirmPassword || !weight || !weightSystem || !height || !heightSystem || !activityLevel || !DOB || !goal || !gender) {
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
        pool.query(`INSERT INTO users (name, email, password, dob, weight, weightsystem, height, heightsystem, gender, activitylevel, goal)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [name, email, hash, DOB, weight, weightSystem, height, heightSystem, gender, activityLevel, goal], (err, result) => {
                        if (err) {
                            console.log(err.message);
                        } else {
                            res.status(200).send({message: 'Successfully registered!'});
                        }
                    })
    });
});


app.post('/login', (req, res, next) => {
    const postAuthenticationFunc = passport.authenticate('local', {failureMessage:true, successMessage: true}, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err)
            };
            res.send({status: `${info.message}`, user: req.user});
        });
        
    });
    postAuthenticationFunc(req,res,next);
});

app.get('/logout', (req, res) => {
    console.log('laina')
    req.logOut((err) => {
        if (err) {
            console.log(err)
        }
        res.send(`logged out`);    
    });
    
})

app.get('/login/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.send({status: 'Authenticated', user: req.user});
    } else {
        res.send({status: 'Not authenticated'})
    };
});

app.get('/get/chartdata/daily', (req, res) => {
    const userEmail = req.query.user;
    const date = new Date();
    const year = (date.getFullYear()).toString();
    const month = (date.getMonth() + 1).toString();
    const day = (date.getDate()).toString();
    const dateStr = `${year}-${month}-${day}`;

    pool.query(`SELECT * FROM nutritional_time_series
                WHERE date::text LIKE $1
                ORDER BY date ASC`, [`${year}-${month}%`], (err, results) => {
                    if(err) {
                        console.log(err);
                        return
                    }
                    const matches = results.rows;
                    if (matches.length > 0) {
                        let labels = [], protein = [], calories = [];
                        for (let i = 0; i < matches.length; i++) {
                            const match = matches[i];
                            labels.push(match.date);
                            calories.push(match.calories);
                            protein.push(match.protein);
                        }
                        const chartData = {labels, calories, protein};
                        console.log(chartData);
                        res.send({message: 'success', chartData});
                    } else {
                        res.send({message: 'no results'});
                    }
                });
});

app.get('/get/chartdata/monthly', (req, res) => {
    const userEmail = req.query.user;
    const date = new Date();
    const year = (date.getFullYear()).toString();
    const month = (date.getMonth() + 1).toString();
    const day = (date.getDate()).toString();
    const dateStr = `${year}-${month}-${day}`;

    pool.query(`SELECT DATE_TRUNC('month', date) AS month, SUM(protein) as protein, SUM(calories) as calories
                FROM nutritional_time_series
                WHERE date::text LIKE $1
                GROUP BY DATE_TRUNC('month', date);
    `, [`${year}%`], (err, results) => {
                    if(err) {
                        console.log(err);
                        return
                    }
                    const matches = results.rows;
                    if (matches.length > 0) {
                        let labels = [], protein = [], calories = [];
                        const monthMappings = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'};
                        for (let i = 0; i < matches.length; i++) {
                            const match = matches[i];
                            const date = monthMappings[match.month.getMonth()] + ` ${year}`;
                            labels.push(date);
                            calories.push(match.calories);
                            protein.push(match.protein);
                        }
                        const chartData = {labels, calories, protein};
                        console.log(chartData);
                        res.send({message: 'success', chartData});
                    } else {
                        res.send({message: 'no results'});
                    }
                });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});