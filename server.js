const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/') // Upload to images folder
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('Server error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Helper function to read/write projects
const PROJECTS_FILE = path.join(__dirname, 'projects.json');

async function readProjects() {
    try {
        const data = await fs.readFile(PROJECTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading projects:', error);
        return [];
    }
}

async function writeProjects(projects) {
    try {
        await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 4));
        return true;
    } catch (error) {
        console.error('Error writing projects:', error);
        return false;
    }
}

// PUBLIC ROUTES

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load projects' });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body); // Debug log

    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                message: 'All fields are required',
                missing: {
                    name: !name,
                    email: !email,
                    subject: !subject,
                    message: !message
                }
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully'); // Debug log
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Detailed email error:', error); // Debug log
        res.status(500).json({ 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// ADMIN ROUTES

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Image upload endpoint (admin only)
app.post('/api/admin/upload-image', isAuthenticated, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the relative path to the uploaded image
        const imagePath = 'images/' + req.file.filename;
        res.json({
            message: 'Image uploaded successfully',
            imagePath: imagePath
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// Profile picture upload endpoint (admin only)
const profileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images/profile/');
        },
        filename: function (req, file, cb) {
            cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile pictures
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

app.post('/api/admin/upload-profile-picture', isAuthenticated, profileUpload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePicturePath = 'images/profile/' + req.file.filename;

        // Update profile with new picture
        const PROFILE_FILE = path.join(__dirname, 'admin-profile.json');
        const profileData = JSON.parse(await fs.readFile(PROFILE_FILE, 'utf8'));
        profileData.profilePicture = profilePicturePath;
        await fs.writeFile(PROFILE_FILE, JSON.stringify(profileData, null, 4));

        res.json({
            message: 'Profile picture uploaded successfully',
            profilePicture: profilePicturePath
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Failed to upload profile picture' });
    }
});

// Add project (admin only)
app.post('/api/admin/projects/add', isAuthenticated, async (req, res) => {
    try {
        const projects = await readProjects();
        const newProject = req.body;

        // Ensure unique ID
        if (!newProject.id) {
            newProject.id = Date.now().toString();
        }

        projects.push(newProject);
        const success = await writeProjects(projects);

        if (success) {
            res.json({ message: 'Project added successfully', project: newProject });
        } else {
            res.status(500).json({ message: 'Failed to save project' });
        }
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Failed to add project' });
    }
});

// Update project (admin only)
app.post('/api/admin/projects/update', isAuthenticated, async (req, res) => {
    try {
        const projects = await readProjects();
        const updatedProject = req.body;
        const index = projects.findIndex(p => p.id === updatedProject.id);

        if (index !== -1) {
            projects[index] = updatedProject;
            const success = await writeProjects(projects);

            if (success) {
                res.json({ message: 'Project updated successfully', project: updatedProject });
            } else {
                res.status(500).json({ message: 'Failed to save project' });
            }
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Failed to update project' });
    }
});

// Delete project (admin only)
app.post('/api/admin/projects/delete', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.body;
        const projects = await readProjects();
        const filteredProjects = projects.filter(p => p.id !== id);

        if (filteredProjects.length < projects.length) {
            const success = await writeProjects(filteredProjects);

            if (success) {
                res.json({ message: 'Project deleted successfully' });
            } else {
                res.status(500).json({ message: 'Failed to delete project' });
            }
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Failed to delete project' });
    }
});

// PROFILE MANAGEMENT ROUTES

// Get admin profile
app.get('/api/admin/profile', isAuthenticated, async (req, res) => {
    try {
        const PROFILE_FILE = path.join(__dirname, 'admin-profile.json');
        const profileData = JSON.parse(await fs.readFile(PROFILE_FILE, 'utf8'));
        res.json(profileData);
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).json({ message: 'Failed to load profile' });
    }
});

// Update admin profile
app.post('/api/admin/profile/update', isAuthenticated, async (req, res) => {
    try {
        const { fullName, email, bio } = req.body;
        const PROFILE_FILE = path.join(__dirname, 'admin-profile.json');

        const profileData = JSON.parse(await fs.readFile(PROFILE_FILE, 'utf8'));
        profileData.fullName = fullName;
        profileData.email = email;
        profileData.bio = bio;

        await fs.writeFile(PROFILE_FILE, JSON.stringify(profileData, null, 4));
        res.json({ message: 'Profile updated successfully', profile: profileData });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Change password
app.post('/api/admin/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

        // Verify current password
        if (currentPassword !== ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // In production, you would update the password in a secure database
        // For now, we'll update the .env file (not recommended for production)
        // You should implement a proper password hashing system

        // Update environment variable (temporary - will reset on server restart)
        process.env.ADMIN_PASSWORD = newPassword;

        res.json({
            message: 'Password changed successfully. Please update your .env file with the new password to make it permanent.',
            warning: 'Password will reset on server restart unless you update the .env file'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// Serve admin pages
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

app.get('/admin/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'profile.html'));
});

app.get('/admin', (req, res) => {
    if (req.session && req.session.isAdmin) {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Portfolio: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
});



