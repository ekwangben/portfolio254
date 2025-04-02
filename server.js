const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
// Make sure to use the port Render provides
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Change this to 'public' if your static files are in a public folder
app.use(express.static('.')); // Serve static files from root directory

// Add this near the top to ensure the server is responding
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Email configuration error:", error);
    } else {
        console.log("Server is ready to send emails");
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Email options
        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Shows sender's name but uses your email
            replyTo: email, // Allows you to reply directly to the sender
            to: 'ekwangbenard@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            text: `New message from your portfolio website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from your portfolio contact form.`,
            html: `
                <h2>New message from your portfolio website</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message}</p>
                <hr>
                <p><em>This email was sent from your portfolio contact form.</em></p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

const server = app.listen(PORT, '0.0.0.0', () => {
    const address = server.address();
    console.log(`Server is running on port ${address.port}`);
    console.log(`Server address: ${JSON.stringify(address)}`);
});

// Error handling
server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});



