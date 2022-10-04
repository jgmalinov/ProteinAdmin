const express = require('express');
const app = express();
const { pool } = require("../DB/dbConfig");

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false})); 

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', (req, res, next) => {
    let {name, email, password, password2, weight, weightSystem, height, heightSystem, activityLevel} = req.body;
    console.log(name,  height, heightSystem);
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})