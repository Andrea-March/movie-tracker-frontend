import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WatchedMovies from "./pages/WatchedMovies";
import ToWatchMovies from "./pages/ToWatchMovies";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Explore from "./pages/Explore";
import Challenges from "./pages/Challenges";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";

function App() {

  const token = localStorage.getItem('token')

  return (
    <Router>
      <div>
        {token && <Navbar />}
          <Routes>
            <Route path="/test" element={<ProtectedRoute element={Test} />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/" element={<ProtectedRoute element={Navigate("/movies/watched")} />} /> */}
            <Route path="movies/explore" element={<ProtectedRoute element={Explore} />} />
            <Route path="movies/watched" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="movies/to-watch" element={<ProtectedRoute element={ToWatchMovies} />}  />
            <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/challenges/:challengeId" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/groups" element={<ProtectedRoute element={Groups} />} />



             {/* La route 404 va alla fine per gestire tutte le altre URL non corrispondenti */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;