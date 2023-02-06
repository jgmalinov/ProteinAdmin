const express = require('express');
const app = express();
const { pool } = require("./DB/dbConfig");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const initialize = require('./PassportConfig');
const cors = require('cors');
const format = require('pg-format');

initialize(passport);

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


app.use(express.static('build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    store: new pgSession({
        pool: pool
    }),
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', async (req, res, next) => {
    let {name, email, password, confirmPassword, weight, weightSystem, height, heightSystem, gender, activityLevel, DOB, goal} = req.body;
    const {calories, protein} = req.query;

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
    
    pool.query(`SELECT * FROM "user" WHERE email = $1`, [email], (err, results) => {
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
            pool.query(`INSERT INTO "user" (name, email, password, dob, weight, weightsystem, height, heightsystem, gender, activitylevel, goal)
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
    let {name, weight, height, goal, activityLevel, dob} = profileEdits;
    weight = parseFloat(weight);
    height = parseFloat(height);
    dob = new Date(dob);

    pool.query(`UPDATE "user"
                SET 
                name =          CASE
                                    WHEN $1 <> name THEN $2
                                    ELSE name
                                END,
                weight =        CASE
                                    WHEN $3::float <> weight THEN $4::float
                                    ELSE weight
                                END,
                height =        CASE
                                    WHEN $5::float <> height THEN $6::float
                                    ELSE height
                                END,                           
                goal =          CASE
                                    WHEN $7 <> goal THEN $8
                                    ELSE goal
                                END,
                activityLevel = CASE
                                    WHEN $9 <> activitylevel THEN $10
                                    ELSE activitylevel
                                END,
                dob =           CASE
                                    WHEN $11::DATE <> dob THEN $12::DATE
                                    ELSE dob
                                END
                WHERE email = $13`, [name, name, weight, weight, height, height, goal, goal, activityLevel, activityLevel, dob, dob, email], (err, result) => {
                                if (err) {
                                    throw(err)
                                }

                                pool.query(`SELECT name, email, dob, height, heightsystem, weight, weightsystem, goal, activitylevel, gender, admin
                                            FROM "user"
                                            WHERE email=$1`, [email], (err, result) => {
                                                if (err) {
                                                    throw(err)
                                                }
                                                if (result.rows.length > 0) {
                                                    const {name, email, dob, height, heightsystem, weight, weightsystem, goal, activitylevel, gender, admin} = result.rows[0];
                                                    const user = {name, email, dob, height, heightSystem: heightsystem, weight, weightSystem: weightsystem, goal, activityLevel: activitylevel, gender, menu: {}, admin};
                                                    
                                                    req.logout((err) => {
                                                        if (err) {
                                                            throw(err)
                                                        }
                                                        req.logIn(user, (err) => {
                                                            if (err) {
                                                                throw(err)
                                                            };
                                                            res.send({message: 'Success'});
                                                        });
                                                    });
                                                } else {
                                                    res.send({message: 'No user data'})
                                                }
                                            });
                            });
});


app.post('/login', (req, res, next) => {
    const postAuthenticationFunc = passport.authenticate('local', {failureMessage:true, successMessage: true}, (err, user, info) => {
        if (err) {
            throw(err);
        }
        req.logIn(user, (err) => {
            if (err) {
                throw(err)
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
            throw(err)
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
    // const currentDateStr = `${currentDate.getDate() + 1}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    // const priorDateStr = `${priorDate.getDate() + 1}-${priorDate.getMonth() + 1}-${priorDate.getFullYear()}`;
    

    pool.query(`SELECT l.date, l.email, r.calories, r.protein
                FROM (
                    SELECT generate_series::date AS date, $1 AS email
                    FROM generate_series($2::date, $3::date, '1 day')
                ) l
                LEFT JOIN (
                    SELECT * FROM nutritional_time_series
                    WHERE email=$4
                ) r
                ON l.date = r.date
                ORDER BY l.date ASC;`, [userEmail, priorDate, currentDate, userEmail], (err, results) => {
                    if(err) {
                        throw(err);
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
    

    pool.query(`SELECT l.date as date, l.email as email, r.calories as calories, r.protein as protein FROM (
                            SELECT DATE_TRUNC('month', generate_series) as date, $1 as email
                            FROM generate_series($2::date, $3::date, '1 day')
                            GROUP BY DATE_TRUNC('month', generate_series)
                            ORDER BY DATE_TRUNC('month', generate_series) ASC
                ) l
                LEFT JOIN (
                            SELECT DATE_TRUNC('month', date) as date, SUM(protein) as protein, SUM(calories) as calories
                            FROM nutritional_time_series
                            WHERE date BETWEEN $4 AND $5
                            AND email=$6
                            GROUP BY DATE_TRUNC('month', date)
                            ORDER BY DATE_TRUNC('month', date) ASC
                    ) r
                ON l.date = r.date
                ORDER BY l.date ASC;`, [userEmail, previousDate, currentDate, previousDate, currentDate, userEmail], (err, results) => {
                    if(err) {
                        throw(err);
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
                        res.send({message: 'success', chartData, chartType: 'monthly'});
                    } else {
                        res.send({message: 'no results'});
                    }
                });
});

app.get('/foodform/:category', (req, res) => {
    const category  = req.params.category;
    pool.query(`SELECT subcategory.name FROM category
                JOIN subcategory ON category.id = subcategory.category_id
                WHERE category.name = $1`, [category], (err, result) => {
        if (err) {
            throw(err)
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

    new Promise((resolve) => {
        resolve(
            pool.query(`INSERT INTO subcategory (name, category_id)
            SELECT $1 as subcategoryName, id FROM category WHERE name=$2
            AND NOT EXISTS(SELECT name FROM subcategory WHERE name=$3);`, [form.subcategory, form.category, form.subcategory], (err, results) => {
                if (err) {
                    throw(err);
                }
                console.log('successfully added subcategory');
            })
        )
    }).then((result) => {
        pool.query(`INSERT INTO value (calories, protein)
                SELECT $1 as calories, $2 as protein WHERE NOT EXISTS(SELECT * FROM value WHERE calories=$3 AND protein=$4);`, [form.values.calories, form.values.protein, form.values.calories, form.values.protein], (err, result) => {
                    if (err) {
                        throw(err)
                    }
                    console.log('successfully added values');
        })
    }).then((result) => {
        pool.query(`INSERT INTO variation(type, brand, subcategory_id, value_id)
                SELECT $1 as type, $2 as brand, subcategory.id, value.id 
                FROM subcategory, value
                WHERE subcategory.name=$3 AND value.protein=$4 AND value.calories=$5
                AND NOT EXISTS(SELECT type, brand FROM variation
                              WHERE type=$6 AND brand=$7)`, [form.variation.type, form.variation.brand, form.subcategory, form.values.protein, form.values.calories, form.variation.type, form.variation.brand],
                              (err, result) => {
                                if (err) {
                                    throw(err)
                                }
                                console.log('successfully added variation');
                                res.status(200).send('Item successfully added!');
                              })

    })
});

app.get('/table', (req, res) => {
    pool.query(`SELECT category.id as id, category.name as category, subcategory.name as subcategory, variation.type as description, variation.brand as brand, value.calories as calories, value.protein as protein 
                FROM category
                JOIN subcategory ON category.id=subcategory.category_id
                JOIN variation ON subcategory.id=variation.subcategory_id
                JOIN value ON variation.value_id=value.id
                ORDER by id`, (err, result) => {
                    if (err) {
                        throw(err)
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
                        throw(err);
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
                        throw(err);
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
