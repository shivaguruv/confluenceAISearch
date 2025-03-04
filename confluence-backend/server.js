const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'https://confluencefrontend.onrender.com', // Allow requests from this frontend
    credentials: true,
}));

app.use(express.json());

// Confluence API Configuration
const CONFLUENCE_BASE_URL = 'https://shivaguruvenkateswaran.atlassian.net';
const AUTH_TYPE = 'Basic'; // Use Basic Auth for simplicity (not recommended for production)

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Use Basic Auth to authenticate with Confluence
        const authHeader = `Basic ${Buffer.from(`${username.trim()}:${password.trim()}`).toString('base64')}`;

        // Fetch the current user to verify credentials
        const response = await axios.get(`${CONFLUENCE_BASE_URL}/wiki/rest/api/user/current`, {
            headers: {
                'Authorization': authHeader, // Send username and password as Basic Auth
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5006'
            }
        });

        // Handle the response
        res.status(200).json({ message: 'Authentication successful', user: response.data });
    } catch (error) {
        console.error('Login error:', error.message);

        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ error: 'No response received from the server.' });
        } else {
            // Something happened in setting up the request
            res.status(500).json({ error: 'An error occurred while making the request.' });
        }
    }
});

// Search Endpoint
app.post('/api/search', async (req, res) => {
    const { username, password, searchText } = req.body;

    if (!username || !password || !searchText) {
        return res.status(400).json({ error: 'Username, password, and search text are required.' });
    }

    try {
        // Use Basic Auth to authenticate with Confluence
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        // Search Confluence pages
        const response = await axios.get(`${CONFLUENCE_BASE_URL}/wiki/rest/api/search?cql=text~"${encodeURIComponent(searchText)}"`, {
            headers: {
                'Authorization': authHeader, // Send username and password as Basic Auth
                'Content-Type': 'application/json'
            },
        });

        res.status(200).json({ results: response.data.results });
    } catch (error) {
        console.error('Search error:', error.message);

        // Handle errors
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            res.status(500).json({ error: 'No response received from the server.' });
        } else {
            res.status(500).json({ error: 'An error occurred while making the request.' });
        }
    }
});

// Test Database Endpoint
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT 1'); // Example query
        res.status(200).json({ message: 'Database connection successful', result });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
