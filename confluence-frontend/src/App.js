import { useState } from "react";
import Login from "./login";
import Home from "./home";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      {page === "login" ? <Login setPage={setPage} /> : <Home />}
    </div>
  );
}

export default App;
