import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://confluenceaisearch-xsea.onrender.com/api/login', {
        username,
        password,
      });

      if (response.data.message === 'Authentication successful') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      alert('Invalid username or password');
      console.error('Login error:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.post('https://confluenceaisearch-xsea.onrender.com/api/search', {
        username,
        password,
        searchText,
      });

      // Ensure results is always an array
      const resultsData = response.data && response.data.results ? response.data.results : [];
      setResults(resultsData);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to fetch search results');
      setResults([]); // Avoid crashing by setting an empty array
    } finally {
      setLoading(false);
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

          {loading && <div className="spinner"></div>}

          <div className="results">
            {loading && <div className="spinner"></div>}

            {!loading && searched && results.length === 0 && (
              <p className="no-results">No results found.</p>
            )}

            {!loading && results.length > 0 &&
              results.map((page) => (
                <div key={page.id} className="page-result">
                  <a
                    href={`https://${username}:${password}@shivaguruvenkateswaran.atlassian.net/wiki${page.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="page-link"
                  >
                    {page.content.title}
                  </a>
                </div>
              ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
