const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-userid-originalname
    const uniqueName = `${Date.now()}-${req.session.userId}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter - accept only specific types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|png|jpg|jpeg|xls|xlsx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, XLS, XLSX, PPT, PPTX'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = (db) => {
  // Upload file
  router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { subject, grade, description } = req.body;
      const userId = req.session.userId;

      // Save file metadata to database
      db.run(
        `INSERT INTO files (user_id, original_name, stored_name, file_type, file_size, subject, grade, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          req.file.originalname,
          req.file.filename,
          req.file.mimetype,
          req.file.size,
          subject || '',
          grade || '',
          description || ''
        ],
        function(err) {
          if (err) {
            console.error('Error saving file metadata:', err);
            // Delete uploaded file if database save fails
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: 'Failed to save file' });
          }

          res.json({
            success: true,
            file: {
              id: this.lastID,
              originalName: req.file.originalname,
              fileType: req.file.mimetype,
              fileSize: req.file.size,
              subject: subject || '',
              grade: grade || '',
              description: description || ''
            }
          });
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get user's files
  router.get('/my-files', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { subject, grade } = req.query;

    let query = 'SELECT id, original_name, file_type, file_size, subject, grade, description, uploaded_at FROM files WHERE user_id = ?';
    let params = [userId];

    if (subject) {
      query += ' AND subject = ?';
      params.push(subject);
    }

    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY uploaded_at DESC';

    db.all(query, params, (err, files) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        files: files.map(file => ({
          id: file.id,
          originalName: file.original_name,
          fileType: file.file_type,
          fileSize: file.file_size,
          subject: file.subject,
          grade: file.grade,
          description: file.description,
          uploadedAt: file.uploaded_at
        }))
      });
    });
  });

  // Download file
  router.get('/download/:fileId', requireAuth, (req, res) => {
    const fileId = req.params.fileId;
    const userId = req.session.userId;

    // Get file metadata and verify ownership
    db.get(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, userId],
      (err, file) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!file) {
          return res.status(404).json({ error: 'File not found or access denied' });
        }

        const filePath = path.join(__dirname, '../uploads', file.stored_name);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'File not found on server' });
        }

        // Update download count
        db.run('UPDATE users SET downloads = downloads + 1 WHERE id = ?', [userId]);

        // Send file
        res.download(filePath, file.original_name, (err) => {
          if (err) {
            console.error('Download error:', err);
            if (!res.headersSent) {
              res.status(500).json({ error: 'Failed to download file' });
            }
          }
        });
      }
    );
  });

  // Delete file
  router.delete('/delete/:fileId', requireAuth, (req, res) => {
    const fileId = req.params.fileId;
    const userId = req.session.userId;

    // Get file metadata and verify ownership
    db.get(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, userId],
      (err, file) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!file) {
          return res.status(404).json({ error: 'File not found or access denied' });
        }

        const filePath = path.join(__dirname, '../uploads', file.stored_name);

        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Delete file metadata from database
        db.run('DELETE FROM files WHERE id = ?', [fileId], (err) => {
          if (err) {
            console.error('Error deleting file metadata:', err);
            return res.status(500).json({ error: 'Failed to delete file' });
          }

          res.json({ success: true });
        });
      }
    );
  });

  // Get file statistics
  router.get('/stats', requireAuth, (req, res) => {
    const userId = req.session.userId;

    db.get(
      `SELECT
        COUNT(*) as totalFiles,
        SUM(file_size) as totalSize,
        COUNT(DISTINCT subject) as totalSubjects
       FROM files WHERE user_id = ?`,
      [userId],
      (err, stats) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          totalFiles: stats.totalFiles || 0,
          totalSize: stats.totalSize || 0,
          totalSubjects: stats.totalSubjects || 0
        });
      }
    );
  });

  return router;
};
