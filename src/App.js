import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WatchedMovies from "./pages/WatchedMovies";
import ToWatchMovies from "./pages/ToWatchMovies";
import Navbar from "./components/Navbar";
import Error from "./components/Error";
import SuccessPopup from "./components/SuccessPopup";
import MovieDetailPopup from "./components/MovieDetailPopup";
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
import Loader from "./components/Loader";
import PersonDetailPopup from "./components/PersonDetailPopup";
import SubNavbar from "./components/SubNavbar";
import MoviesLists from "./pages/MoviesLists";
function App() {

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
        {token && 
          (<>
            <MovieDetailPopup  />
            <PersonDetailPopup />
            <Error />
            <SuccessPopup />
            <Loader />
          </>)
        }
          <Routes>
         {/*    <Route path="/test" element={<ProtectedRoute element={Test} />}/> */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/movies/watched"/>} />
            {/* <Route path="movies/explore" element={<ProtectedRoute element={Explore} />} />
            <Route path="movies/watched" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="movies/to-watch" element={<ProtectedRoute element={ToWatchMovies} />}  /> */}
            <Route path="/movies" element={<ProtectedRoute element={MoviesLists} />}  /> 
            <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/challenges/:challengeId" element={<ProtectedRoute element={ChallengeDetail} />} />
            <Route path="/groups" element={<ProtectedRoute element={Groups} />} />



             {/* La route 404 va alla fine per gestire tutte le altre URL non corrispondenti */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {token && 
          (<>
            <Navbar />
          </>)
        }
      </div>
    </Router>
  );
}

export default App;