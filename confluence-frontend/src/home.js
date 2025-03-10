import { useState, useEffect } from "react";

function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username"); 

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Redirect only if no username is stored (after the initial render)
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login"; // Ensure proper redirect
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        {/* Clicking "Confluence AI" reloads home page */}
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => window.location.reload()} // Soft reload
        >
          Confluence AI
        </h1>

        {/* User Dropdown */}
        {username && (
          <div className="relative">
            <button
              className="text-gray-700 font-medium focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username} ▼
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Search Bar */}
      <div className="bg-white py-4 px-6 shadow sticky top-[64px] z-40">
        <form className="w-full max-w-4xl mx-auto">
          <input
            type="search"
            className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Confluence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </form>
      </div>
    </div>
  );
}

export default Home;
