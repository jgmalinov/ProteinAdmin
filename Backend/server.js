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
    console.log('logged out')
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
    const currentDate = new Date();
    const priorDate = new Date();
    priorDate.setDate(currentDate.getDate() - 30);
    console.log(priorDate);
    /* const year = (date.getFullYear()).toString();
    const month = (date.getMonth() + 1).toString();
    const day = (date.getDate()).toString();
    const dateStr = `${year}-${month}-${day}`; */

    pool.query(`SELECT * FROM nutritional_time_series
                WHERE date >= $1 
                AND date <= $2
                ORDER BY date ASC`, [priorDate, currentDate], (err, results) => {
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
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 365 + currentDate.getDate() + 1);
    console.log(currentDate, previousDate);

    pool.query(`SELECT DATE_TRUNC('month', date) as date, SUM(protein) as protein, SUM(calories) as calories
                FROM nutritional_time_series
                WHERE date BETWEEN $1 AND $2
                GROUP BY DATE_TRUNC('month', date)
                ORDER BY DATE_TRUNC('month', date) ASC
    `, [previousDate, currentDate], (err, results) => {
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

app.get('/foodform/:category', (req, res) => {
    const category  = req.params.category;
    pool.query(`SELECT subcategories.name FROM categories
                JOIN subcategories ON categories.id = subcategories.category_id
                WHERE categories.name = $1`, [category], (err, result) => {
        if (err) {
            console.log(err)
        }
        const rows = result.rows;
        if (rows.length > 0) {
            res.send({subcategories: rows});
        } else {
            res.send({subcategories: 'none'});
        }
    })
});

app.post('/foodform', (req, res) => {
    const form = req.body;
    console.log(form);

    new Promise((resolve) => {
        resolve(
            pool.query(`INSERT INTO subcategories (name, category_id)
            SELECT $1 as subcategoryName, id FROM categories WHERE name=$2
            AND NOT EXISTS(SELECT name FROM subcategories WHERE name=$3);`, [form.subcategory, form.category, form.subcategory], (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('successfully added subcategory');
            })
        )
    }).then((res) => {
        pool.query(`INSERT INTO values (calories, protein)
                SELECT $1 as calories, $2 as protein WHERE NOT EXISTS(SELECT * FROM values WHERE calories=$3 AND protein=$4);`, [form.values.calories, form.values.protein, form.values.calories, form.values.protein], (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log('successfully added values');
        })
    }).then((res) => {
        pool.query(`INSERT INTO variations(type, brand, subcategory_id, value_id)
                SELECT $1 as type, $2 as brand, subcategories.id, values.id 
                FROM subcategories, values
                WHERE subcategories.name=$3 AND values.protein=$4 AND values.calories=$5
                AND NOT EXISTS(SELECT type, brand FROM variations
                              WHERE type=$6 AND brand=$7)`, [form.variation.type, form.variation.brand, form.subcategory, form.values.protein, form.values.calories, form.variation.type, form.variation.brand],
                              (err, result) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log('successfully added variation');
                              })

    })
});


    

    

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});