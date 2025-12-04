const { Pool } = require('pg');

// 🚨 validación estricta
if (!process.env.DATABASE_URL) {
    console.error('🔥 ERROR CRÍTICO: No hay variable DATABASE_URL configurada.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
