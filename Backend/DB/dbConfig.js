const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.REACT_APP_DB_USER}:${process.env.REACT_APP_DB_PASSWORD}@${process.env.REACT_APP_DB_HOST}:${process.env.REACT_APP_DB_PORT}/${process.env.REACT_APP_DB_DATABASE}`;


const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction ? {
        rejectUnauthorized: false
      } : false
});

module.exports = { pool };
