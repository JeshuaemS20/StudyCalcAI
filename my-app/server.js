require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

let dbReady = false;

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expression TEXT NOT NULL,
        result TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    dbReady = true;
    console.log('PostgreSQL connected and ready.');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    dbReady = false;
  }
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', database: dbReady ? 'connected' : 'unavailable' });
});

app.post('/api/auth/signup', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database is not available yet.' });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database is not available yet.' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/calculations', async (_req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database is not available yet.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, expression, result, created_at FROM calculations ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/calculations', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database is not available yet.' });
  }

  const { expression, result, userId } = req.body;

  if (!expression || !result) {
    return res.status(400).json({ error: 'expression and result are required.' });
  }

  try {
    const inserted = await pool.query(
      'INSERT INTO calculations (user_id, expression, result) VALUES ($1, $2, $3) RETURNING id, expression, result, created_at',
      [userId || null, expression, result]
    );
    res.status(201).json(inserted.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initializeDatabase();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
