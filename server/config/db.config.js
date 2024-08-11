require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${encodeURIComponent(process.env.PGPASSWORD)}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),
};
