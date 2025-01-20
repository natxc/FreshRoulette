require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${encodeURIComponent(process.env.PGPASSWORD)}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.PGHOST !== "localhost" ? { rejectUnauthorized: false } : false
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),
};
