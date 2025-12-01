// Authentication JavaScript for Edusphere Central
// Handles login, signup, and session management using localStorage

// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('edusphere_users')) || [];

// Get current user from session
let currentUser = JSON.parse(sessionStorage.getItem('edusphere_current_user')) ||
                  JSON.parse(localStorage.getItem('edusphere_current_user')) || null;

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('alert-message');
    alertDiv.textContent = message;
    alertDiv.className = `mb-4 p-4 rounded-lg ${
        type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' :
        'bg-red-100 text-red-700 border border-red-400'
    }`;
    alertDiv.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveUsersToStorage() {
    localStorage.setItem('edusphere_users', JSON.stringify(users));
}

function setCurrentUser(user, rememberMe = false) {
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    };

    // Always save to sessionStorage
    sessionStorage.setItem('edusphere_current_user', JSON.stringify(userData));

    // Save to localStorage if "Remember Me" is checked
    if (rememberMe) {
        localStorage.setItem('edusphere_current_user', JSON.stringify(userData));

        // Set cookie with 30 days expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `edusphere_user=${user.email}; expires=${expiryDate.toUTCString()}; path=/`;
    }

    currentUser = userData;
}

function clearCurrentUser() {
    sessionStorage.removeItem('edusphere_current_user');
    localStorage.removeItem('edusphere_current_user');
    document.cookie = 'edusphere_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    currentUser = null;
}

// Password visibility toggle
function setupPasswordToggle(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (button && input) {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

// Form Switching
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const loginContainer = document.getElementById('login-form-container');
const signupContainer = document.getElementById('signup-form-container');

if (showSignupBtn && showLoginBtn) {
    showSignupBtn.addEventListener('click', () => {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
        document.getElementById('alert-message').classList.add('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        document.getElementById('alert-message').classList.add('hidden');
    });
}

// Check for hash in URL
if (window.location.hash === '#signup') {
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
}

// Setup password toggles
setupPasswordToggle('toggle-login-password', 'login-password');
setupPasswordToggle('toggle-signup-password', 'signup-password');
setupPasswordToggle('toggle-confirm-password', 'signup-confirm-password');

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading state
        const btnText = document.getElementById('login-btn-text');
        const spinner = document.getElementById('login-spinner');
        btnText.textContent = 'Logging in...';
        spinner.classList.remove('hidden');

        // Simulate API call delay
        setTimeout(() => {
            // Validate email format
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                btnText.textContent = 'Login';
                spinner.classList.add('hidden');
                return;
            }

            // Find user
            const user = users.find(u => u.email === email);

            if (!user) {
                showAlert('No account found with this email. Please sign up first.', 'error');
                btnText.textContent = 'Login';
                spinner.classList.add('hidden');
                return;
            }

            if (user.password !== password) {
                showAlert('Incorrect password. Please try again.', 'error');
                btnText.textContent = 'Login';
                spinner.classList.add('hidden');
                return;
            }

            // Successful login
            setCurrentUser(user, rememberMe);
            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        }, 800);
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Show loading state
        const btnText = document.getElementById('signup-btn-text');
        const spinner = document.getElementById('signup-spinner');
        btnText.textContent = 'Creating Account...';
        spinner.classList.remove('hidden');

        // Simulate API call delay
        setTimeout(() => {
            // Validate inputs
            if (!name || name.length < 2) {
                showAlert('Please enter a valid name (at least 2 characters)', 'error');
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
                return;
            }

            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
                return;
            }

            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                showAlert('An account with this email already exists. Please login.', 'error');
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
                return;
            }

            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'error');
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match. Please try again.', 'error');
                btnText.textContent = 'Create Account';
                spinner.classList.add('hidden');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                stats: {
                    totalNotes: 0,
                    downloads: 0,
                    quizzesTaken: 0,
                    studyStreak: 0
                }
            };

            // Add to users array and save
            users.push(newUser);
            saveUsersToStorage();

            // Auto login
            setCurrentUser(newUser, false);
            showAlert('Account created successfully! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        }, 800);
    });
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // If on login/index page and user is already logged in, redirect to home
    const path = window.location.pathname;
    const isIndexPage = path.includes('index.html') || path.endsWith('/') || path === '';

    console.log('🔍 Path check:', path, '| Is index page:', isIndexPage, '| Current user:', currentUser);

    if (isIndexPage && currentUser) {
        console.log('✅ Redirecting to home.html');
        window.location.href = 'home.html';
    }
});

// Export functions for use in other scripts
window.EdusphereAuth = {
    getCurrentUser: () => currentUser,
    logout: clearCurrentUser,
    isLoggedIn: () => currentUser !== null,
    getUsers: () => users
};

// Console message
console.log('🔐 Authentication system initialized');
console.log('📊 Total registered users:', users.length);
if (currentUser) {
    console.log('👤 Current user:', currentUser.name);
}