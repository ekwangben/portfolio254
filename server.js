const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static('.'));

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// IMPORTANT: This is the critical part for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

