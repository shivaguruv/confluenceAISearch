import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  const handleLogin = async () => {
    try {
const response = await axios.post(
  `${API_BASE_URL}/api/login`,
  {
    username,
    password,
  },
  {
    headers: {
      'Content-Type': 'application/json',  // Ensures correct content type
      'Accept': 'application/json',        // Ensures JSON response
      'Access-Control-Allow-Origin': '*',  // Debugging CORS issues
    },
    timeout: 10000,  // Set a timeout (10 seconds)
  }
);


      if (response.data.message === 'Authentication successful') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      alert('Invalid username or password');
      console.error('Login error:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username,
        password,
        searchText,
      });
      console.log(JSON.stringify(response.data));
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to fetch search results');
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login-form">
          <h2>Login to Confluence</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="home-page">
          <h2>Welcome to Confluence</h2>
          <input
            type="text"
            placeholder="Search Confluence Pages"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <div className="results">
            {results.length > 0 ? (
              results.map((page) => (
                
                <div key={page.id} className="page-result">
                  {/* Make the title a hyperlink */}
                  <a
                    href={`https://${username}:${password}shivaguruvenkateswaran.atlassian.net/wiki${page.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="page-link"
                  >
                    {page.content.title} 
                  </a>
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
