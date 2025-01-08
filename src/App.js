import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WatchedMovies from "./pages/WatchedMovies";
import ToWatchMovies from "./pages/ToWatchMovies";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Explore from "./pages/Explore";
import Challenges from "./pages/Challenges";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";

function App() {

  return (
    <Router>
      <div>
        <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="/explore" element={<ProtectedRoute element={Explore} />} />
            <Route path="/watched" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="/to-watch" element={<ProtectedRoute element={ToWatchMovies} />}  />
            <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/groups" element={<ProtectedRoute element={Groups} />} />



             {/* La route 404 va alla fine per gestire tutte le altre URL non corrispondenti */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;