// Authentication JavaScript for Edusphere Central
// Handles login, signup, and session management using backend API + localStorage

const API_BASE_URL = 'http://localhost:3000/api';
const STORAGE_KEY = 'edusphere_user';

// Get current user from localStorage
let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Save user to localStorage
function saveUserToStorage(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    currentUser = user;
}

// Clear user from localStorage
function clearUserFromStorage() {
    localStorage.removeItem(STORAGE_KEY);
    currentUser = null;
}

// Initialize authentication state - verify with backend
async function initAuth() {
    // First check localStorage
    if (currentUser) {
        try {
            // Verify session is still valid with backend
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Update localStorage with fresh data
                saveUserToStorage(data.user);
                console.log('👤 Session verified:', currentUser.name);
                return true;
            } else {
                // Session expired on backend, clear localStorage
                console.log('Session expired, clearing local storage');
                clearUserFromStorage();
                return false;
            }
        } catch (error) {
            console.log('Could not verify session with backend');
            // Keep localStorage user if backend is unreachable
            return currentUser !== null;
        }
    }
    return false;
}

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('alert-message');
    if (!alertDiv) return;

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
        const alertDiv = document.getElementById('alert-message');
        if (alertDiv) alertDiv.classList.add('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        const alertDiv = document.getElementById('alert-message');
        if (alertDiv) alertDiv.classList.add('hidden');
    });
}

// Check for hash in URL
if (window.location.hash === '#signup' && loginContainer && signupContainer) {
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
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading state
        const btnText = document.getElementById('login-btn-text');
        const spinner = document.getElementById('login-spinner');
        const submitBtn = this.querySelector('button[type="submit"]');

        btnText.textContent = 'Logging in...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Validate email format
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }

            // Send login request to backend
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.error || 'Login failed', 'error');
                return;
            }

            // Save user to localStorage
            saveUserToStorage(data.user);

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            showAlert('Connection error. Please make sure the server is running.', 'error');
        } finally {
            btnText.textContent = 'Login';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const grade = document.getElementById('signup-grade')?.value || '';

        // Show loading state
        const btnText = document.getElementById('signup-btn-text');
        const spinner = document.getElementById('signup-spinner');
        const submitBtn = this.querySelector('button[type="submit"]');

        btnText.textContent = 'Creating Account...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Validate inputs
            if (!name || name.length < 2) {
                showAlert('Please enter a valid name (at least 2 characters)', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }

            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match. Please try again.', 'error');
                return;
            }

            // Send signup request to backend
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password, grade })
            });

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.error || 'Signup failed', 'error');
                return;
            }

            // Save user to localStorage
            saveUserToStorage(data.user);

            showAlert('Account created successfully! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);

        } catch (error) {
            console.error('Signup error:', error);
            showAlert('Connection error. Please make sure the server is running.', 'error');
        } finally {
            btnText.textContent = 'Create Account';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
}

// Logout function
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Always clear localStorage and redirect
    clearUserFromStorage();
    window.location.href = 'index.html';
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', async function() {
    const path = window.location.pathname;
    const isIndexPage = path.includes('index.html') || path.endsWith('/') || path === '';

    console.log('🔍 Path:', path, '| Is index page:', isIndexPage, '| Has stored user:', currentUser !== null);

    // If on login/index page and user is logged in, redirect to home
    if (isIndexPage && currentUser) {
        console.log('✅ User is logged in, redirecting to home.html');
        window.location.href = 'home.html';
        return;
    }

    // If NOT on index page and user is NOT logged in, redirect to login
    if (!isIndexPage && !currentUser) {
        console.log('❌ User not logged in, redirecting to index.html');
        window.location.href = 'index.html';
        return;
    }
});

// Export functions for use in other scripts
window.EdusphereAuth = {
    getCurrentUser: () => currentUser,
    logout: logout,
    isLoggedIn: isLoggedIn,
    refreshUser: initAuth,
    saveUser: saveUserToStorage,
    clearUser: clearUserFromStorage
};

// Console message
console.log('🔐 Authentication system initialized');
if (currentUser) {
    console.log('👤 Logged in as:', currentUser.name);
}
