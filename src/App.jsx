
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home"
import SpotifyCallback from "./components/SpotifyCallback";
import Profile from "./components/Profile";

const App = () => {
  return (
    <Router>
       <h1>🚀 React App is Loaded</h1> {/* TEMPORARY CHECK */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
