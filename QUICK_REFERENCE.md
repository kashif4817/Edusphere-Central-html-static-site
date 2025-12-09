# Edusphere Central - Quick Reference Guide

## 🚀 Getting Started (3 Steps)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/server.js` | Main backend server |
| `server/routes/auth.js` | Authentication API |
| `server/routes/files.js` | File management API |
| `server/database/init.js` | Database setup |
| `auth.js` | Frontend authentication |
| `files.js` | Frontend file management |
| `my-files.html` | File upload/download page |
| `.env` | Configuration (PORT, secrets) |

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/signup    - Create account
POST   /api/auth/login     - Login
POST   /api/auth/logout    - Logout
GET    /api/auth/me        - Get current user
```

### Files
```
POST   /api/files/upload           - Upload file
GET    /api/files/my-files         - List files
GET    /api/files/download/:id     - Download file
DELETE /api/files/delete/:id       - Delete file
GET    /api/files/stats            - Get statistics
```

## 🗄️ Database Tables

**users** - User accounts
```
id, name, email, password (hashed), grade, created_at, stats
```

**files** - Uploaded files
```
id, user_id, original_name, stored_name, file_type,
file_size, subject, grade, description, uploaded_at
```

**sessions** - User sessions
```
id, user_id, session_token, expires_at, created_at
```

## 📝 User Flow

1. **Signup** → [index.html](index.html) → Create account
2. **Login** → Dashboard ([home.html](home.html))
3. **Upload** → My Files ([my-files.html](my-files.html)) → Upload files
4. **Manage** → Download, delete, filter files
5. **PDF** → Generate summary PDF
6. **Logout** → Back to login

## 🔒 Security Features

- ✅ Bcrypt password hashing
- ✅ Session-based authentication
- ✅ User file isolation
- ✅ File type validation
- ✅ Size limits (10MB)
- ✅ SQL injection prevention

## 📋 File Types Allowed

- PDF (.pdf)
- Documents (.doc, .docx, .txt)
- Images (.png, .jpg, .jpeg)
- Spreadsheets (.xls, .xlsx)
- Presentations (.ppt, .pptx)

**Max size:** 10MB

## 🛠️ Configuration (.env)

```env
PORT=3000                    # Server port
SESSION_SECRET=your-secret   # Change for production!
DATABASE_PATH=./server/database/edusphere.db
UPLOADS_PATH=./server/uploads
```

## 🐛 Troubleshooting

**Server won't start:**
- Run `npm install` first
- Check if port 3000 is available

**Can't login:**
- Make sure server is running
- Use `http://localhost:3000` (not file://)

**File upload fails:**
- Check file type is allowed
- Ensure file is under 10MB
- Make sure you're logged in

**Database error:**
- Delete `server/database/edusphere.db` to reset
- Restart server

## 📦 Dependencies

```json
{
  "express": "Web server framework",
  "sqlite3": "Database",
  "bcrypt": "Password hashing",
  "express-session": "Session management",
  "multer": "File uploads",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

## 🔧 Development Commands

```bash
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-reload (if nodemon installed)
```

## 📊 User Statistics Tracked

- Total notes viewed
- Files downloaded
- Quizzes taken
- Study streak (days)

## 🎯 Key Features

1. **Multi-user support** - Each user has isolated account
2. **Secure auth** - Hashed passwords, sessions
3. **File management** - Upload, download, delete
4. **PDF generation** - Create file summaries
5. **Filtering** - By subject and grade
6. **Metadata** - Subject, grade, description per file

## 📱 Pages

- `/` - Login/Signup
- `/home` - Dashboard
- `/notes` - Subject browser
- `/my-files` - File management ⭐
- `/resources` - Study resources
- `/pricing` - Pricing plans
- `/about` - About page
- `/contact` - Contact form

## 🌟 What Changed from Before

**Before:**
- Client-side only (localStorage)
- No real database
- Hardcoded test data
- No file uploads
- Plain text passwords

**After:**
- Full backend with Node.js
- SQLite database
- Real user accounts
- Complete file system
- Encrypted passwords
- Session management

## 💡 Quick Tips

1. **First time setup:** Just run `npm install` then `npm start`
2. **Testing:** Create 2+ accounts to test multi-user isolation
3. **Reset:** Delete `.db` file to clear all data
4. **Logs:** Check terminal for server logs and errors
5. **Production:** Change SESSION_SECRET before deploying!

## 📖 Documentation

- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete implementation details
- [README.md](README.md) - Project overview

## 🎓 Project Structure

```
Edusphere-Central/
├── Frontend (HTML/CSS/JS)
│   ├── index.html (Login/Signup)
│   ├── home.html (Dashboard)
│   ├── my-files.html (File Management)
│   ├── auth.js (Auth logic)
│   └── files.js (File logic)
│
├── Backend (Node.js/Express)
│   ├── server/server.js (Main server)
│   ├── server/routes/ (API endpoints)
│   ├── server/middleware/ (Auth checks)
│   └── server/database/ (SQLite DB)
│
└── Storage
    ├── server/database/edusphere.db (User data)
    └── server/uploads/ (User files)
```

---

**Need help?** Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed guidance!
