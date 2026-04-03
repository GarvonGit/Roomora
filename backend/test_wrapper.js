const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:pass@db.kcjydweoxiwiuliphocb.supabase.co:5432/postgres'
});
const originalQuery = pool.query.bind(pool);
pool.query = async (text, params) => {
    try {
        return await originalQuery(text, params);
    } catch (e) {
        console.log('INTERCEPTED:', e.message);
        return { rows: [] };
    }
};
async function test() {
    try {
        const res = await pool.query('SELECT 1');
        console.log('Success!', res.rows);
    } catch(e) {
        console.error('FAILED TO CATCH:', e);
    }
}
test();
