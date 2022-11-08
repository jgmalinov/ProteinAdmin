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
const format = require('pg-format');
const { abs } = require('mathjs');

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
    let {name, email, password, confirmPassword, weight, weightSystem, height, heightSystem, gender, activityLevel, DOB, goal} = req.body;
    const {calories, protein} = req.query;
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
        }; 
        if (results.rows.length > 0) {
            errors.errors.push({message: 'User with this email already exists'});
            res.send(errors);
            return;
        };
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            pool.query(`INSERT INTO users (name, email, password, dob, weight, weightsystem, height, heightsystem, gender, activitylevel, goal)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [name, email, hash, DOB, weight, weightSystem, height, heightSystem, gender, activityLevel, goal], (err, result) => {
                            if (err) {
                                throw(err)
                            } 
                            res.status(200).send({message: 'Successfully registered!'});
                            const entriesBatch = [];
                            const currentDate = new Date()
                            let days = 31;
                            
                        
                            do {
                                const newDate = new Date();
                                newDate.setDate(currentDate.getDate() - days);
                                const entry = [newDate, calories, protein, email];
                                entriesBatch.push(entry);
                                days -= 1;
                            } while (days > 0);

                            pool.query(format(`INSERT INTO nutritional_time_series(date, calories, protein, email)
                                        VALUES %L`, entriesBatch), (err, results) => {
                                            if (err) {
                                                throw(err)
                                            }
                                            console.log(results.rows);
                            })
                        }
            );
        });
    });
});


app.post('/edit', (req, res, next) => {
    const email = req.user.email;
    const profileEdits = req.body;
    const {name, weight, height, goal, activityLevel, dob} = profileEdits;

    pool.query(`UPDATE users
                SET name =  CASE
                                WHEN $1 <> name THEN $1
                            END
                SET weight =  CASE
                                WHEN $2 <> name THEN $2
                            END
                SET height =  CASE
                                WHEN $3 <> name THEN $3
                            END                            
                SET goal =  CASE
                                WHEN $4 <> name THEN $4
                            END
                SET activityLevel = CASE
                                        WHEN $5 <> name THEN $5
                                    END
                SET dob =   CASE
                                WHEN $6 <> name THEN $6
                            END`, [name, weight, height, goal, activityLevel, dob], (err, result) => {
                                if (err) {
                                    throw(err)
                                }
                                console.log(result.rows);
                            })
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
                AND email = $3
                ORDER BY date ASC`, [priorDate, currentDate, userEmail], (err, results) => {
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
                        res.send({message: 'success', chartData, chartType: 'daily'});
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
                        res.send({message: 'success', chartData, chartType: 'monthly'});
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

app.get('/table', (req, res) => {
    pool.query(`SELECT categories.id as id, categories.name as category, subcategories.name as subcategory, variations.type as description, variations.brand as brand, values.calories as calories, values.protein as protein 
                FROM categories
                JOIN subcategories ON categories.id=subcategories.category_id
                JOIN variations ON subcategories.id=variations.subcategory_id
                JOIN values ON variations.value_id=values.id
                ORDER by id`, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    const table = result.rows;
                    res.send({table});
                })
});

app.get('/menu', (req, res) => {
    const email = req.user.email;
    const date = new Date();
    pool.query(`SELECT description, SUM(calories) AS calories, SUM(protein) AS protein, SUM(weight) AS weight, BOOL_AND(committed) as committed FROM daily_nutrition
                WHERE email=$1 AND date=$2 AND committed = true
                GROUP BY DESCRIPTION
                UNION 
                SELECT description, SUM(calories) AS calories, SUM(protein) AS protein, SUM(weight) AS weight, BOOL_AND(committed) as committed FROM daily_nutrition
                WHERE email=$1 AND date=$2 AND committed = false
                GROUP BY DESCRIPTION`, [email, date], (err, result) => {
                    if (err) {
                        console.log(err);
                    } 
                    if (result.rows.length === 0) {
                        res.send({message: 'No logged data'})
                    } else {
                        res.send({menu: result.rows})
                    };
                })
});

app.post('/menu', (req, res) => {
    const batchData = req.body;
    const date = new Date();
    const email = req.user.email;
    const currentBatch = [];
    for (let i=0; i < batchData.length; i++) {
        const mealObj = batchData[i];
        const description = Object.keys(batchData[i])[0];
        const currentMeal = [date, email, description, mealObj[description].calories, mealObj[description].protein, mealObj[description].weight, false];
        currentBatch.push(currentMeal);

    }

    pool.query(format(`INSERT INTO daily_nutrition (date, email, description, calories, protein, weight, committed)
                VALUES %L`, currentBatch), (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send({message: err})
                    }
                    res.send('Successfully inserted data')
                });
});

app.delete('/menu', (req, res) => {
    const description = req.body.description;
    pool.query(`DELETE FROM daily_nutrition
                WHERE description=$1`, [description], (err, result) => {
                    if (err) {
                        throw(err)
                    }
                    res.send({message: `Successfully deleted data entry`});
                });
});

app.put('/menu', (req, res) => {
    const date = new Date();
    const email = req.user.email;
    pool.query(`UPDATE daily_nutrition
                SET committed=true
                WHERE date = $1 AND email = $2 AND committed = false`, [date, email], (err, result) => {
                    if (err) {
                        throw(err)
                    };
                    res.send({message: 'Successfully committed outstanding daily_nutrition entries'});
                })
});

app.post('/timeseries', (req, res) => {
    const email = req.user.email;
    const date = new Date();
    const calories = req.body.calories;
    const protein = req.body.protein;

    pool.query(`INSERT INTO nutritional_time_series(date, calories, protein, email)
                VALUES
                ($1, $2, $3, $4)
                ON CONFLICT ON CONSTRAINT unique_date_email_nts DO UPDATE
                SET calories = nutritional_time_series.calories + EXCLUDED.calories, protein = nutritional_time_series.protein + EXCLUDED.protein
                WHERE nutritional_time_series.date = $5 AND nutritional_time_series.email=$6`, [date, calories, protein, email, date, email], (err, result) => {
                    if (err) {
                        throw (err)
                    }
                    res.send({message: 'Successfully updated entry'});
                })
});

app.get('/daily/data', (req, res) => {
    const email = req.user.email;
    const date = new Date();
    
    pool.query(`SELECT calories, protein FROM nutritional_time_series
                WHERE email=$1 AND date=$2`, [email, date], (err, result) => {
                    if (err) {
                        throw(err)
                    }
                    if (result.rows.length === 0) {
                        res.send({calories: 0, protein: 0})
                    } else {
                        const calories = result.rows[0].calories;
                        const protein = result.rows[0].protein;
                        res.send({calories, protein})
                    }
                })
});    
    

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});