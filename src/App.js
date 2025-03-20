import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* import { onMessage, getToken } from 'firebase/messaging';
import {messaging} from './config/firebaseConfig' */
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
/* import Test from "./pages/Test"; */
import ChallengeDetail from "./pages/ChallengeDetails";
import ResetPassword from "./components/ResetPassword";
/* import {jwtDecode} from "jwt-decode"; */

function App() {

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/"

  const token = localStorage.getItem('token');

/*   useEffect(()=>{
    console.log("called app.js useEffect")

     // Chiedi il permesso per ricevere notifiche
    Notification.requestPermission().then(async permission => {
        if (permission === 'granted' && token) {
            console.log('Notification permission granted.');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            try {
              const fcmToken = await getToken(messaging, {
                  vapidKey: process.env.REACT_APP_VAPID_KEY,
              });
      
              if (fcmToken) {
                  // Invia il token al backend
                  await fetch(`${API_URL}users/fcm-token`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ userId, token: fcmToken }),
                  });
              }
          } catch (error) {
              console.error("Errore durante il recupero del token FCM:", error);
          }
        } else {
            console.log('Notification permission denied.');
        }
    });

    // Gestione della ricezione delle notifiche
    onMessage(payload => {
        console.log('Notification received. ', payload);
        // Puoi mostrare una notifica o fare altre operazioni
    });

  },[]) */

  return (
    <Router>
      <div>
        {token && <Navbar />}
          <Routes>
         {/*    <Route path="/test" element={<ProtectedRoute element={Test} />}/> */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/movies/watched"/>} />
            <Route path="movies/explore" element={<ProtectedRoute element={Explore} />} />
            <Route path="movies/watched" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="movies/to-watch" element={<ProtectedRoute element={ToWatchMovies} />}  />
            <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/challenges/:challengeId" element={<ProtectedRoute element={ChallengeDetail} />} />
            <Route path="/groups" element={<ProtectedRoute element={Groups} />} />



             {/* La route 404 va alla fine per gestire tutte le altre URL non corrispondenti */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;