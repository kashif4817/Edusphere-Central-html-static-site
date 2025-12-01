# Authentication System Guide - Edusphere Central

## Overview
Complete authentication system using **localStorage**, **sessionStorage**, and **cookies** for persistent user sessions. All user data is stored locally in JSON format.

---

## Features

✅ **User Registration (Sign Up)**
- Full name, email, password, grade
- Email validation
- Password strength validation (min 6 characters)
- Password confirmation
- Duplicate email check
- Terms & conditions acceptance

✅ **User Login**
- Email and password authentication
- "Remember Me" functionality (30-day cookie)
- Session management
- Password visibility toggle
- Invalid credentials handling

✅ **Session Management**
- sessionStorage for temporary sessions
- localStorage for persistent sessions
- Cookie-based authentication
- Auto-redirect for logged-in users

✅ **Dashboard Protection**
- Authentication check on dashboard load
- Auto-redirect to login if not authenticated
- Display user-specific data

✅ **Logout Functionality**
- Clear all sessions (sessionStorage, localStorage, cookies)
- Confirmation prompt
- Redirect to home page

✅ **Responsive Design**
- Mobile-friendly forms
- Touch-optimized buttons
- Adaptive layout for all screen sizes

---

## File Structure

```
├── login.html          # Login and signup page
├── auth.js             # Main authentication logic
├── dashboard.html      # Protected dashboard page
├── dashboard.js        # Dashboard-specific auth checks
├── check-auth.js       # Optional: Update nav links based on auth status
└── AUTH_GUIDE.md       # This documentation
```

---

## How It Works

### 1. Data Storage

#### localStorage (Persistent)
```javascript
// Stores all registered users
edusphere_users: [
    {
        id: "1701234567890",
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        grade: "10",
        createdAt: "2025-12-01T10:30:00.000Z",
        stats: {
            totalNotes: 0,
            downloads: 0,
            quizzesTaken: 0,
            studyStreak: 0
        }
    }
]

// Stores current user if "Remember Me" is checked
edusphere_current_user: {
    id: "1701234567890",
    name: "John Doe",
    email: "john@example.com",
    grade: "10",
    loginTime: "2025-12-01T10:35:00.000Z"
}
```

#### sessionStorage (Temporary)
```javascript
// Stores current user for session duration
edusphere_current_user: { ... }
```

#### Cookies
```javascript
// 30-day persistent cookie when "Remember Me" is checked
edusphere_user=john@example.com; expires=Sun, 31 Dec 2025 10:35:00 GMT; path=/
```

---

### 2. Sign Up Process

**User Flow:**
1. User fills signup form (name, email, password, confirm password, grade)
2. Click "Create Account"
3. Validation checks:
   - Name length (min 2 characters)
   - Email format validation
   - Email uniqueness check
   - Password length (min 6 characters)
   - Password match confirmation
   - Grade selection
4. Create user object with unique ID (timestamp)
5. Save to localStorage
6. Auto-login user
7. Redirect to dashboard

**Code Example:**
```javascript
const newUser = {
    id: Date.now().toString(),
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    grade: "10",
    createdAt: new Date().toISOString(),
    stats: { ... }
};
users.push(newUser);
localStorage.setItem('edusphere_users', JSON.stringify(users));
```

---

### 3. Login Process

**User Flow:**
1. User enters email and password
2. Optional: Check "Remember Me"
3. Click "Login"
4. Validation:
   - Email format check
   - Find user by email
   - Verify password
5. Set current user in sessionStorage
6. If "Remember Me": Set in localStorage + cookie
7. Redirect to dashboard

**Session Types:**

| Remember Me | sessionStorage | localStorage | Cookie | Duration |
|-------------|----------------|--------------|--------|----------|
| Not checked | ✅ Yes        | ❌ No        | ❌ No  | Until browser closes |
| Checked     | ✅ Yes        | ✅ Yes       | ✅ Yes | 30 days |

---

### 4. Dashboard Authentication

**On Page Load:**
```javascript
// dashboard.js checks authentication
const currentUser = window.EdusphereAuth.getCurrentUser();

if (!currentUser) {
    // Not logged in - redirect to login
    window.location.href = 'login.html';
    return;
}

// Logged in - display user data
updateDashboard(currentUser);
```

---

### 5. Logout Process

**User Flow:**
1. Click "Logout" button
2. Confirmation prompt: "Are you sure you want to logout?"
3. Clear all storage:
   ```javascript
   sessionStorage.removeItem('edusphere_current_user');
   localStorage.removeItem('edusphere_current_user');
   document.cookie = 'edusphere_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
   ```
4. Success message
5. Redirect to home page

---

## Usage Guide

### Testing the Authentication

#### Test Scenario 1: New User Registration
1. Open `login.html`
2. Click "Sign Up"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
   - Grade: 10
   - Check Terms & Conditions
4. Click "Create Account"
5. Should redirect to dashboard
6. Check console: "👤 Logged in as: John Doe"

#### Test Scenario 2: Login (Remember Me)
1. Logout from dashboard
2. Go to `login.html`
3. Enter credentials
4. Check "Remember Me"
5. Click "Login"
6. Should redirect to dashboard
7. Close browser completely
8. Reopen and go to `dashboard.html`
9. Should still be logged in ✅

#### Test Scenario 3: Login (Without Remember Me)
1. Logout and login again
2. Don't check "Remember Me"
3. Close browser completely
4. Reopen and go to `dashboard.html`
5. Should redirect to login ✅

#### Test Scenario 4: Multiple Users
1. Logout
2. Sign up as User 2 (different email)
3. Logout
4. Login as User 1
5. Check dashboard shows User 1 data
6. Logout and login as User 2
7. Check dashboard shows User 2 data

---

## Security Considerations

⚠️ **Important Notes:**

1. **Password Storage**: Passwords are stored in **plain text** in localStorage. This is for educational/demo purposes only. In production:
   - Use backend authentication
   - Hash passwords (bcrypt, argon2)
   - Store only on secure server

2. **localStorage Limitations**:
   - Accessible via JavaScript (XSS vulnerability)
   - No encryption
   - Persistent across sessions
   - Can be cleared by user

3. **Production Recommendations**:
   - Implement JWT tokens
   - Use HTTPS only
   - Add CSRF protection
   - Implement rate limiting
   - Add 2FA (Two-Factor Authentication)
   - Use backend API for all auth operations
   - Encrypt sensitive data
   - Add session timeouts

---

## API Reference

### EdusphereAuth Object

```javascript
// Check if user is logged in
const isLoggedIn = window.EdusphereAuth.isLoggedIn();
// Returns: boolean

// Get current user
const user = window.EdusphereAuth.getCurrentUser();
// Returns: { id, name, email, grade, loginTime } or null

// Logout
window.EdusphereAuth.logout();
// Clears all sessions and cookies

// Get all registered users (for admin purposes)
const allUsers = window.EdusphereAuth.getUsers();
// Returns: Array of user objects
```

---

## Troubleshooting

### Issue: User stays logged in after logout
**Solution:** Clear browser data (localStorage, sessionStorage, cookies)
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### Issue: Login redirects to login again
**Solution:** Check console for errors. Verify auth.js is loaded before dashboard.js

### Issue: "Remember Me" doesn't work
**Solution:** Check if cookies are enabled in browser settings

### Issue: Password doesn't match error
**Solution:** Ensure password fields are identical, check for extra spaces

---

## Customization

### Change Session Duration
```javascript
// In auth.js, modify cookie expiry
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 30); // Change 30 to desired days
```

### Add User Fields
```javascript
// In auth.js, modify newUser object
const newUser = {
    ...existingFields,
    phoneNumber: phoneNumber,
    dateOfBirth: dob,
    // Add any custom fields
};
```

### Change Validation Rules
```javascript
// In auth.js
if (password.length < 8) { // Change from 6 to 8
    showAlert('Password must be at least 8 characters long', 'error');
    return;
}
```

---

## Browser Compatibility

✅ Chrome 60+
✅ Firefox 55+
✅ Safari 12+
✅ Edge 79+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Demo Credentials

After first signup, you can use:
- Email: john@example.com
- Password: password123

Or create your own account!

---

## Support

For issues or questions:
- Check browser console for error messages
- Verify all script files are loaded
- Clear browser cache and try again
- Check this guide for troubleshooting steps

---

**Last Updated:** December 2025
**Version:** 1.0.0
**Author:** Edusphere Central Development Team