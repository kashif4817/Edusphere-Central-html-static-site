# Edusphere Central - Setup Instructions

A complete educational platform with Node.js backend, SQLite database, user authentication, and file management.

## Features

- **User Authentication**: Secure signup/login with bcrypt password hashing
- **Multi-user Support**: Each user has their own isolated account and files
- **File Management**: Upload, download, and delete files (PDFs, documents, images)
- **SQLite Database**: Lightweight database storing users and files
- **PDF Generation**: Create PDF summaries of uploaded files using jsPDF
- **Session Management**: Secure sessions with "Remember Me" functionality
- **User-specific Access**: Users can only see and access their own files

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

Open terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install:
- express (web server)
- sqlite3 (database)
- bcrypt (password hashing)
- express-session (session management)
- multer (file uploads)
- cors (cross-origin requests)
- dotenv (environment variables)

### 2. Environment Configuration

The `.env` file is already created with default settings:

```env
PORT=3000
SESSION_SECRET=edusphere-secret-key-2025-change-in-production
DATABASE_PATH=./server/database/edusphere.db
UPLOADS_PATH=./server/uploads
```

**For production, change the SESSION_SECRET to a strong random string!**

### 3. Database Initialization

The SQLite database will be created automatically when you first start the server. It includes three tables:

- **users**: Stores user accounts (name, email, hashed password, grade, stats)
- **files**: Stores file metadata (name, type, size, subject, grade, description)
- **sessions**: Stores user sessions for authentication

### 4. Start the Server

Run the development server:

```bash
npm start
```

Or with auto-restart on file changes (if you have nodemon):

```bash
npm run dev
```

You should see:

```
╔════════════════════════════════════════════════════════╗
║         Edusphere Central Server Started              ║
╚════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
📊 Database: SQLite (./server/database/edusphere.db)
📁 Uploads directory: ./server/uploads
```

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## Usage Guide

### Creating an Account

1. Go to `http://localhost:3000`
2. Click "Sign Up" or the signup tab
3. Enter your name, email, password, and grade (optional)
4. Click "Create Account"
5. You'll be automatically logged in and redirected to the dashboard

### Logging In

1. Go to `http://localhost:3000`
2. Enter your email and password
3. Check "Remember Me" for persistent login (30 days)
4. Click "Login"

### Managing Files

1. After login, click "My Files" in the navigation
2. **Upload Files**:
   - Click "Choose File" and select a file (max 10MB)
   - Select subject and grade (optional)
   - Add description (optional)
   - Click "Upload File"

3. **Download Files**:
   - Click the green "Download" button next to any file

4. **Delete Files**:
   - Click the red "Delete" button next to any file
   - Confirm deletion

5. **Filter Files**:
   - Use the subject and grade dropdowns to filter your files
   - Click "Refresh" to reload

### Generate PDF Summary

1. Go to "My Files" page
2. Scroll to the bottom
3. Click "Generate PDF Summary"
4. A PDF will be downloaded with all your files organized by subject

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### File Management

- `POST /api/files/upload` - Upload a file
- `GET /api/files/my-files` - Get user's files (with optional subject/grade filters)
- `GET /api/files/download/:fileId` - Download a file
- `DELETE /api/files/delete/:fileId` - Delete a file
- `GET /api/files/stats` - Get file statistics

## File Upload Restrictions

**Allowed file types:**
- PDF (.pdf)
- Documents (.doc, .docx, .txt)
- Images (.png, .jpg, .jpeg)
- Spreadsheets (.xls, .xlsx)
- Presentations (.ppt, .pptx)

**Maximum file size:** 10MB

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt (never stored in plain text)
2. **Session Security**: HTTP-only session cookies prevent XSS attacks
3. **User Isolation**: Each user can only access their own files
4. **File Validation**: Server-side file type and size validation
5. **SQL Injection Prevention**: Parameterized queries protect against SQL injection

## Project Structure

```
Edusphere-Central-html-static-site/
├── server/
│   ├── database/
│   │   ├── init.js          # Database initialization
│   │   └── edusphere.db     # SQLite database (created automatically)
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── files.js         # File management routes
│   ├── uploads/             # User uploaded files
│   └── server.js            # Main server file
├── index.html               # Login/Signup page
├── home.html                # Dashboard
├── my-files.html            # File management page
├── notes.html               # Subjects browser
├── resources.html           # Study resources
├── auth.js                  # Frontend authentication
├── files.js                 # Frontend file management
├── main.js                  # UI interactions
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## Database Schema

### Users Table
```sql
id INTEGER PRIMARY KEY
name TEXT
email TEXT UNIQUE
password TEXT (hashed)
grade TEXT
created_at DATETIME
total_notes INTEGER
downloads INTEGER
quizzes_taken INTEGER
study_streak INTEGER
```

### Files Table
```sql
id INTEGER PRIMARY KEY
user_id INTEGER (foreign key)
original_name TEXT
stored_name TEXT (unique filename on server)
file_type TEXT
file_size INTEGER
subject TEXT
grade TEXT
description TEXT
uploaded_at DATETIME
```

## Troubleshooting

### Server won't start

**Error: `Cannot find module 'express'`**
- Run `npm install` to install dependencies

**Error: `Port 3000 is already in use`**
- Change the PORT in `.env` to another port (e.g., 3001)
- Or stop the process using port 3000

### Cannot login/signup

**Error: "Connection error. Please make sure the server is running."**
- Make sure the Node.js server is running (`npm start`)
- Check that you're accessing `http://localhost:3000` (not opening the HTML file directly)

### Files not uploading

**Error: "Invalid file type"**
- Check that your file is one of the allowed types
- File extensions must match: .pdf, .doc, .docx, .txt, .png, .jpg, .jpeg, .xls, .xlsx, .ppt, .pptx

**Error: "File too large"**
- Maximum file size is 10MB
- Compress your file or split it into smaller parts

### Database issues

**Database locked error**
- Close any SQLite browser/viewer applications
- Restart the server

## Development Tips

1. **Testing**: Use `test-auth.html` to view current auth state and registered users
2. **Database Viewing**: Use DB Browser for SQLite to view the database
3. **Logs**: Check the terminal/console for server logs
4. **Clear Data**: Delete `server/database/edusphere.db` to reset all users and files

## Production Deployment

Before deploying to production:

1. Change `SESSION_SECRET` in `.env` to a strong random string
2. Set `cookie.secure = true` in `server/server.js` (requires HTTPS)
3. Update `API_BASE_URL` in `auth.js` and `files.js` to your production URL
4. Add rate limiting to prevent brute force attacks
5. Set up HTTPS/SSL certificate
6. Configure proper CORS origins
7. Add input sanitization and validation
8. Set up database backups

## Support

For issues or questions:
- Check the console/terminal for error messages
- Review the API endpoints in the server logs
- Ensure all dependencies are installed
- Verify the database file exists in `server/database/`

## License

MIT License - Feel free to modify and use for your educational projects!
