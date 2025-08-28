import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Error from "./components/Error";
import SuccessPopup from "./components/SuccessPopup";
import MovieDetailPopup from "./components/MovieDetailPopup";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Challenges from "./pages/Challenges";
import Groups from "./components/groups/Groups";
import NotFound from "./pages/NotFound";
/* import Test from "./pages/Test"; */
import ChallengeDetail from "./pages/ChallengeDetails";
import ResetPassword from "./components/ResetPassword";
import Loader from "./components/Loader";
import PersonDetailPopup from "./components/PersonDetailPopup";
import MoviesLists from "./pages/MoviesLists";
import GroupDetail from "./pages/GroupDetail";
import JoinRedirect from "./components/groups/JoinRedirect";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
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
            <Route path="/" element={<ProtectedRoute element={HomePage} />} />
            {/* <Route path="movies/explore" element={<ProtectedRoute element={Explore} />} />
            <Route path="movies/watched" element={<ProtectedRoute element={WatchedMovies} />} />
            <Route path="movies/to-watch" element={<ProtectedRoute element={ToWatchMovies} />}  /> */}
            <Route path="/movies" element={<ProtectedRoute element={MoviesLists} />}  /> 
            <Route path="/search" element={<ProtectedRoute element={SearchPage} />}  /> 
            <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
            <Route path="/challenges/:challengeId" element={<ProtectedRoute element={ChallengeDetail} />} />
            <Route path="/groups" element={<ProtectedRoute element={Groups} />} />
            <Route path="/groups/:id" element={<ProtectedRoute element={GroupDetail} />} />
            <Route path="/join/:token" element={<ProtectedRoute element={JoinRedirect} />} />


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