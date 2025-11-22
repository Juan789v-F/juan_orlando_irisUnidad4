require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://darksouls-frontend.onrender.com',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any Render.com subdomain
    if (origin && origin.includes('.onrender.com')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dark Souls Wiki API is running' });
});

// Import routes
const authRoutes = require('./routes/auth');
const bossRoutes = require('./routes/bosses');
const commentRoutes = require('./routes/comments');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/bosses', bossRoutes);
app.use('/api/comments', commentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Run database migration on startup (only in production)
async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    try {
      console.log('🔄 Checking database...');
      const { pool } = require('./config/database');
      
      // Check if bosses table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'bosses'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('📦 Running initial database migration...');
        const { exec } = require('child_process');
        exec('node migrate.js', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Migration error:', error);
          } else {
            console.log(stdout);
          }
        });
      } else {
        console.log('✅ Database already initialized');
      }
    } catch (error) {
      console.error('⚠️  Database check failed:', error.message);
    }
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🔥 Dark Souls Wiki API running on port ${PORT}`);
  await initializeDatabase();
});
