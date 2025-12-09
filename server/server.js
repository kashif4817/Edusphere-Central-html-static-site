const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./database/init');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const { attachUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'edusphere-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours default
    sameSite: 'lax' // Allow cross-origin requests from same site
  }
}));

app.use(attachUser);

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', authRoutes(db));
app.use('/api/files', fileRoutes(db));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Edusphere API is running' });
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'home.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'notes.html'));
});

app.get('/subject', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'subject.html'));
});

app.get('/resources', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resources.html'));
});

app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pricing.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         Edusphere Central Server Started              ║
╚════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📊 Database: SQLite (${process.env.DATABASE_PATH || './server/database/edusphere.db'})
📁 Uploads directory: ${process.env.UPLOADS_PATH || './server/uploads'}

API Endpoints:
  POST   /api/auth/signup
  POST   /api/auth/login
  POST   /api/auth/logout
  GET    /api/auth/me

  POST   /api/files/upload
  GET    /api/files/my-files
  GET    /api/files/download/:fileId
  DELETE /api/files/delete/:fileId
  GET    /api/files/stats

Ready to accept connections!
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
