const { Pool } = require('pg');
const pool = new Pool(!process.env.DEV_MODE ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } } : null);

module.exports = {
    query: (text, params) => pool.query(text, params),
}