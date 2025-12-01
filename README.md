# Edusphere Central - Complete Website

A comprehensive educational platform built with HTML, CSS (Tailwind CDN), and JavaScript.

## 🌟 Features

- **Fully Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Brand Colors** - Royal Blue, Teal, and Yellow theme throughout
- **Interactive Components** - Accordions, tabs, forms, and more

## 📁 File Structure

```
├── index.html          # Homepage with hero section and features
├── notes.html          # Browse all subjects page
├── subject.html        # Individual subject page with chapters
├── resources.html      # Study resources (past papers, planners, etc.)
├── pricing.html        # Pricing plans and FAQ
├── about.html          # About us page
├── contact.html        # Contact form and information
├── login.html          # Login and signup forms
├── dashboard.html      # Student dashboard (after login)
├── main.js             # Main JavaScript file
├── image.png           # Logo file
└── README.md           # This file
```

## 🎨 Pages Overview

### 1. Homepage (index.html)
- Hero section with CTA buttons
- "Why Edusphere Central?" section with 4 key features
- Featured subjects grid (6 subjects)
- Study resources preview slider
- Student testimonials
- Call-to-action section

### 2. Notes & Subjects (notes.html)
- Grade filter dropdown
- Search functionality
- 6 subject cards (Physics, Chemistry, Math, Biology, CS, English)
- Each card includes chapters count, features, and download option

### 3. Subject Page (subject.html)
- Dynamic content based on URL parameter (e.g., ?subject=physics)
- Breadcrumb navigation
- Grade selector tabs (9-12)
- Expandable chapter accordion
- Each chapter includes: Summary, Numericals, Short/Long Questions, MCQs, PDF download

### 4. Study Resources (resources.html)
- Past papers section (organized by subject and year)
- Short revision notes (1-page summaries, mind maps, quick facts)
- Solved examples (numerical and theoretical)
- Study planners (weekly, exam prep, daily to-do)

### 5. Pricing (pricing.html)
- 3 pricing tiers: Free, Standard ($9.99), Premium ($19.99)
- Feature comparison table
- FAQ section
- Clear call-to-action buttons

### 6. About Us (about.html)
- Mission statement
- Vision statement
- Our story
- Core values (Accuracy, Accessibility, Innovation, Student Support)
- Statistics (10,000+ students, 500+ notes, etc.)
- Team section

### 7. Contact (contact.html)
- Contact form with validation
- Contact information (email, phone, hours, location)
- Social media links
- Map placeholder

### 8. Login/Signup (login.html)
- Toggle between login and signup forms
- Social login options (Google, Facebook, Apple)
- Form validation
- Redirects to dashboard after successful login/signup

### 9. Dashboard (dashboard.html)
- Sidebar navigation
- Statistics cards (Total Notes, Downloads, Quizzes, Study Streak)
- Recently viewed notes
- Continue studying section with progress bars
- Quick access buttons
- Subscription status banner

## 🚀 Getting Started

1. Open `index.html` in your web browser to view the homepage
2. All pages are linked together through the navigation menu
3. The website uses Tailwind CSS via CDN (no installation required)
4. Font Awesome icons are loaded via CDN

## 🎯 Key Features by Page

### Interactive Elements
- Mobile-responsive hamburger menu
- Expandable chapter accordions
- Grade tab switching
- Form validation
- Smooth scroll animations
- Login/Signup form toggle

### Brand Identity
- **Primary Color**: Royal Blue (#1e3a8a)
- **Accent Color**: Teal (#14b8a6)
- **Highlight Color**: Yellow (#fbbf24)
- **Font**: Tailwind's default font stack (Inter-based)

## 💻 Technology Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **JavaScript (Vanilla)** - No frameworks required
- **Font Awesome 6** - Icon library

## 📱 Responsive Design

All pages are fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎓 Educational Features

- **6 Main Subjects**: Physics, Chemistry, Mathematics, Biology, Computer Science, English
- **4 Grade Levels**: Grade 9, 10, 11, 12
- **Study Materials**: Chapter notes, Past papers, Solved examples, Study planners
- **Interactive Learning**: Quizzes, Progress tracking, Study streaks

## 📝 Customization

To customize colors, edit the `tailwind.config` section in each HTML file:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'royal-blue': '#1e3a8a',
                'teal': '#14b8a6',
                'yellow': '#fbbf24',
            }
        }
    }
}
```

## 🔗 Navigation Structure

```
Home → Notes & Subjects → Subject Details (with chapters)
     → Study Resources
     → Pricing
     → About
     → Contact
     → Login/Signup → Dashboard
```

## ⚡ JavaScript Functionality

The `main.js` file includes:
- Mobile menu toggle
- Chapter accordion functionality
- Grade tab switching
- Contact form submission
- Subject page dynamic content loading
- Smooth scrolling
- Study timer tracking
- Scroll animations

## 🎉 Ready to Use

This is a complete, production-ready website that can be:
1. Deployed to any web hosting service
2. Integrated with a backend (Node.js, PHP, Python, etc.)
3. Connected to a database for dynamic content
4. Enhanced with additional features as needed

## 📞 Support

For questions or issues, refer to the contact page or email: support@eduspherecentral.com

---

**Built with ❤️ for students worldwide**

© 2025 Edusphere Central. All rights reserved.
