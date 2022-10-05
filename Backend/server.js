const express = require('express');
const app = express();
const { pool } = require("../DB/dbConfig");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin');
    next();
});

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/register', (req, res, next) => {
    let {name, email, password, password2, weight, weightSystem, height, heightSystem, activityLevel} = req.body;
    console.log(req.body);
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})