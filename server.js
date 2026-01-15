const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



