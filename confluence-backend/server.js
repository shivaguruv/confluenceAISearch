const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({ origin: 'https://confluencefrontend.onrender.com' }));
app.use(express.json());

// Confluence API Configuration
const CONFLUENCE_BASE_URL = 'https://shivaguruvenkateswaran.atlassian.net';
const AUTH_TYPE = 'Basic'; // Use OAuth for production

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Verify credentials by fetching the current user
        const response = await axios.get(`${CONFLUENCE_BASE_URL}/wiki/rest/api/user/current`, {
            headers: {
                Authorization: `${AUTH_TYPE} ${Buffer.from(`${username}:${password}`).toString('base64')}`,
            },
        });

        if (response.status === 200) {
            res.status(200).json({ message: 'Login successful', user: response.data });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Search Endpoint
app.post('/api/search', async (req, res) => {
    //https://shivaguruvenkateswaran.atlassian.net/wiki/rest/api/search?cql=text~'salesforce'
    const { username, password, searchText } = req.body;

    if (!username || !password || !searchText) {
        return res.status(400).json({ error: 'Username, password, and search text are required.' });
    }

    try {
        // Search Confluence pages
        const response = await axios.get(`${CONFLUENCE_BASE_URL}/wiki/rest/api/search?cql=text~"${encodeURIComponent(searchText)}"`, {
            headers: {
                Authorization: `${AUTH_TYPE} ${Buffer.from(`${username}:${password}`).toString('base64')}`,
            },
        });

        res.status(200).json({ results: response.data.results });
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
