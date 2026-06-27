const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

const PORT = process.env.PORT || 5000;
const app = express();


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// health route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

