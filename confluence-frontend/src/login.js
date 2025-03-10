import { useState } from "react";
import "./App.css";

function Login({ setPage }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    if (!username || !password) {
      setError("Username and password are required!"); 
      return;
    }

    setLoading(true);

    try {
        localStorage.setItem("username", username); // Store username
      // API call to Confluence
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Assuming successful response
      if (response.status === 200) {
        console.log(response)
        setPage("home"); // Navigate to Home component
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Seamless Login for Confluence AI Search
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            This AI-powered feature provides answers based on accessible information across your Confluence site, excluding restricted content.
          </p>
        </div>

        <form
          className="max-w-md md:ml-auto w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
            Sign in to Confluence
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Username</label>
              <input
                name="email"
                type="email"
                required
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter SOEID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                required
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter PAT token"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="button"
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center justify-center"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
