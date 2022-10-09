const localStrategy = require('passport-local').Strategy;
const { pool } = require('./DB/dbConfig');
const bcrypt = require('bcrypt');

function initialize(passport) {
    function authenticateUser(email, password, done) {
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } 
                const matches = results.rows;
                if (matches.length > 0) {
                    const match = matches[0];
                    bcrypt.compare(password, match.password, (err, isMatch) => {
                        if (err) {
                            console.log(err)
                        } else if (isMatch) {
                            return done(null, match, {message: 'Success'});
                        } else if (!isMatch) {
                            return done(null, false, {message: 'Password incorrect'})
                        }
                    })
                } else {
                    return done(null, false, {message: 'Email is not registered'})
                }
            }
        );
    };

    passport.use(
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => {
        return done(null, user)
    });

    passport.deserializeUser((user, done) => {
        return done(null, user)
    });

};

module.exports = initialize;