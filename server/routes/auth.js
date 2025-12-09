const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (db) => {
  // Signup endpoint
  router.post('/signup', async (req, res) => {
    try {
      const { name, email, password, grade } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      if (name.length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if user already exists
      db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
          return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.run(
          'INSERT INTO users (name, email, password, grade) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, grade || ''],
          function(err) {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ error: 'Failed to create user' });
            }

            // Create session
            req.session.userId = this.lastID;
            req.session.email = email;
            req.session.name = name;

            res.json({
              success: true,
              user: {
                id: this.lastID,
                name,
                email,
                grade: grade || ''
              }
            });
          }
        );
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Login endpoint
  router.post('/login', (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create session
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.name = user.name;

        // Set session expiry based on "Remember Me"
        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            grade: user.grade,
            stats: {
              totalNotes: user.total_notes,
              downloads: user.downloads,
              quizzesTaken: user.quizzes_taken,
              studyStreak: user.study_streak
            }
          }
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Logout endpoint
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  router.get('/me', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    db.get('SELECT id, name, email, grade, total_notes, downloads, quizzes_taken, study_streak FROM users WHERE id = ?',
      [req.session.userId],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            grade: user.grade,
            stats: {
              totalNotes: user.total_notes,
              downloads: user.downloads,
              quizzesTaken: user.quizzes_taken,
              studyStreak: user.study_streak
            }
          }
        });
      }
    );
  });

  return router;
};
