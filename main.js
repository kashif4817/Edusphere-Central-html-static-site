// Main JavaScript file for Edusphere Central

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Chapter Accordion
    const chapterHeaders = document.querySelectorAll('.chapter-header');
    chapterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.fa-chevron-down');

            // Toggle content
            content.classList.toggle('hidden');

            // Rotate icon
            if (icon) {
                icon.style.transform = content.classList.contains('hidden')
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)';
            }
        });
    });

    // Grade Tab Switching
    const gradeTabs = document.querySelectorAll('.grade-tab');
    gradeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            gradeTabs.forEach(t => {
                t.classList.remove('active', 'bg-royal-blue', 'text-white');
                t.classList.add('bg-gray-200', 'text-gray-700');
            });

            // Add active class to clicked tab
            this.classList.add('active', 'bg-royal-blue', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');

            // Here you would typically load grade-specific content
            const grade = this.getAttribute('data-grade');
            console.log('Loading content for grade:', grade);
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Form submitted:', formData);

            // Show success message
            const messageDiv = document.getElementById('form-message');
            messageDiv.textContent = 'Thank you for your message! We will get back to you soon.';
            messageDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-700';
            messageDiv.classList.remove('hidden');

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        });
    }

    // Subject Page - Dynamic Content Loading
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');

    if (subject) {
        loadSubjectContent(subject);
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#signup') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Add search functionality here
        });
    });

    // Grade Filter
    const gradeFilter = document.getElementById('grade-filter');
    if (gradeFilter) {
        gradeFilter.addEventListener('change', function() {
            const selectedGrade = this.value;
            console.log('Filtering by grade:', selectedGrade);
            // Add filtering logic here
        });
    }

    // Mobile Sidebar Toggle for Dashboard
    const mobileSidebarBtn = document.getElementById('mobile-sidebar-btn');
    if (mobileSidebarBtn) {
        mobileSidebarBtn.addEventListener('click', function() {
            // Add mobile sidebar functionality here
            alert('Mobile sidebar functionality');
        });
    }
});

// Function to load subject-specific content
function loadSubjectContent(subject) {
    const subjectData = {
        physics: {
            name: 'Physics',
            icon: '⚛️',
            description: 'High-quality, exam-ready physics notes and solved numerical problems.'
        },
        chemistry: {
            name: 'Chemistry',
            icon: '🧪',
            description: 'Comprehensive chemistry notes with chemical equations and reactions.'
        },
        math: {
            name: 'Mathematics',
            icon: '📐',
            description: 'Detailed mathematics notes with step-by-step solutions.'
        },
        biology: {
            name: 'Biology',
            icon: '🧬',
            description: 'Complete biology notes with diagrams and classification tables.'
        },
        cs: {
            name: 'Computer Science',
            icon: '💻',
            description: 'Computer science notes with code examples and programming concepts.'
        },
        english: {
            name: 'English',
            icon: '📖',
            description: 'English grammar, composition, and literature notes with essay samples.'
        }
    };

    const data = subjectData[subject];
    if (data) {
        // Update page title
        document.title = `${data.name} - Edusphere Central`;

        // Update breadcrumb
        const subjectNameElement = document.getElementById('subject-name');
        if (subjectNameElement) {
            subjectNameElement.textContent = data.name;
        }

        // Update subject header
        const subjectIcon = document.getElementById('subject-icon');
        const subjectTitle = document.getElementById('subject-title');

        if (subjectIcon) subjectIcon.textContent = data.icon;
        if (subjectTitle) subjectTitle.textContent = data.name;
    }
}

// Download functionality
function downloadFile(fileName) {
    console.log('Downloading:', fileName);
    alert(`Download functionality for ${fileName} would be implemented here`);
}

// Add to favorites
function addToFavorites(item) {
    console.log('Adding to favorites:', item);
    alert('Added to favorites!');
}

// Track study time
let studyTimer = null;
let studySeconds = 0;

function startStudyTimer() {
    if (studyTimer === null) {
        studyTimer = setInterval(() => {
            studySeconds++;
            console.log('Study time:', studySeconds, 'seconds');
        }, 1000);
    }
}

function stopStudyTimer() {
    if (studyTimer !== null) {
        clearInterval(studyTimer);
        studyTimer = null;
        console.log('Study session ended. Total time:', studySeconds, 'seconds');
    }
}

// Initialize study timer on relevant pages
if (window.location.pathname.includes('subject.html')) {
    startStudyTimer();

    window.addEventListener('beforeunload', () => {
        stopStudyTimer();
    });
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Console welcome message
console.log('%cWelcome to Edusphere Central!', 'color: #1e3a8a; font-size: 24px; font-weight: bold;');
console.log('%cSimplify Your Studies, Amplify Your Success', 'color: #14b8a6; font-size: 16px;');