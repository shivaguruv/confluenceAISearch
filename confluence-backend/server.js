const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://confluencefrontend.onrender.com', // Allow any frontend (Not recommended for production)
  credentials: true,
}));

app.use(express.json());

// Confluence API Configuration
const CONFLUENCE_BASE_URL = 'https://shivaguruvenkateswaran.atlassian.net';
const AUTH_TYPE = 'Basic'; // Use OAuth for production

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
    const data = {
        username: username,
        password: password,
    };

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Verify credentials by fetching the current user
        const response = await axios.get(`${CONFLUENCE_BASE_URL}/wiki/rest/api/user/current`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            // Set a session cookie (for demonstration purposes)
            res.cookie('sessionToken', 'your-session-token', { httpOnly: true });
            res.status(200).json({ message: 'Login successful', user: response.data });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: error });
    }
});

// Search Endpoint
app.post('/api/search', async (req, res) => {
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
    console.log(`Server is running on ${PORT}`);
});
