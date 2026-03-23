const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to Db!');
        const schema = fs.readFileSync('./db/init.sql', 'utf8');
        await client.query(schema);
        console.log('Migration Complete!');
    } catch(err) {
        console.error(err);
    } finally {
        await client.end();
    }
})();
