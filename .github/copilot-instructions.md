# Copilot Instructions - Erot Portfolio

## Project Overview
This is a **professional portfolio website** for Erot Benard, a web developer. It's a full-stack application with a static frontend (portfolio showcase) backed by an Express.js server that handles contact form submissions via email.

## Architecture

### Frontend-Backend Separation
- **Frontend**: Pure HTML/CSS/JavaScript SPA served as static files (index.html, styles.css, script.js)
- **Backend**: Express.js server (server.js) that serves static files AND provides `/api/contact` endpoint
- **Communication**: Client sends form data via fetch to `/api/contact`

### Key Components
1. **index.html**: Multi-section portfolio layout with hero, about, skills, projects, and contact sections
2. **styles.css**: CSS custom properties with light/dark mode support via `data-theme` attribute
3. **script.js**: DOM interactions - theme toggle, smooth scrolling, typing animation, form submission, project modal
4. **server.js**: Express server with nodemailer integration for email delivery

## Critical Conventions & Patterns

### Theme System (Light/Dark Mode)
- Uses `data-theme` attribute on `<body>` tag (values: "light" or "dark")
- CSS variables managed in `:root` selector with dark mode overrides in `[data-theme="dark"]`
- Theme toggle button ID: `#theme-toggle`; toggles between light/dark and swaps Font Awesome icons (fa-moon/fa-sun)

### Form Handling
- Contact form ID: `contact-form`
- Server expects POST to `/api/contact` with JSON body: `{name, email, subject, message}`
- Client shows loading state on submit button with spinner icon
- Server returns validation errors with detailed missing field info
- Uses nodemailer with Gmail SMTP; requires `.env` with `EMAIL_USER` and `EMAIL_PASS`

### Project Data Structure
- Projects stored in `projectsData` array in script.js with schema: `id, title, image, description, features, techStack, metrics, githubLink, linkedinLink`
- Modal populates dynamically via `openProjectModal(projectId)` function
- Only one project defined; follow pattern for adding more

### Styling Approach
- CSS custom properties (--primary-color, --accent-color, etc.) enable theme switching
- Overlay system: `body::before` pseudo-element with rgba overlay for text readability
- Responsive breakpoints use `.reveal` class for scroll animations
- Font Awesome 6.4.0 for icons (CDN-loaded)

## Developer Workflows

### Start Development
```bash
npm install
npm start  # Runs server.js on PORT (default 3000)
```

### Environment Setup
Create `.env` file in project root:
```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=3000
```
Note: Gmail requires app-specific password, not account password.

### Debug Contact Form Issues
- Check server console logs: `console.log()` statements in server.js at form submission
- Check browser console: script.js logs form data before and after fetch
- Verify `.env` variables loaded: `require('dotenv').config()` in server.js top
- Email delivery test: check Gmail "Sent" folder or transporter.verify() logs

## Integration Points & External Dependencies

### NPM Packages
- **express**: Static file serving + API endpoint hosting
- **nodemailer**: Email sending (Gmail SMTP)
- **cors**: Enable cross-origin requests if needed
- **dotenv**: Environment variable management

### External Resources
- Font Awesome 6.4.0: CDN for icons
- Placeholder images: picsum.photos for demo project images
- Google Maps API: Referenced in tech stack but not implemented

### File Assets
- **assets/**: CV document (CURRICULUM VITAE.pdf)
- **images/**: Portfolio images (me.png.png, app screenshots, background image)

## Common Tasks & Patterns

### Add New Project
1. Push object to `projectsData` array in script.js (follow existing schema)
2. Add image file to images/ folder
3. Update metrics/techStack/features as needed
4. Modal rendering is automatic

### Update Theme Colors
1. Modify CSS variables in `:root` selector (styles.css top)
2. Add corresponding `[data-theme="dark"]` overrides
3. Test contrast ratio for accessibility (especially text on colored backgrounds)

### Modify Contact Form
1. Update HTML form fields in index.html (section id="contact")
2. Update field extraction in script.js `contactForm.addEventListener('submit'...` handler
3. Update server validation in server.js `/api/contact` route
4. Update email template in `mailOptions.html`

## Known Issues & Conventions

- Image paths: Some inconsistencies in HTML (e.g., `images/me.png.png`); verify actual filenames in images/ folder
- Static file serving: Express serves all files from current directory (`.`); be careful with sensitive files
- Email verification: Server logs transporter verification; failures prevent emails but don't crash server
- Modal scroll blocking: Sets `document.body.style.overflow: hidden` when modal open (remember to restore)
