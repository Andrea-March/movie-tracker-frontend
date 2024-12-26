import React, {useState, useEffect} from "react";
import {fetchUserMovies} from '../services/movieservice'
import '../App.css'
import './WatchedMovies.css'


const ToWatchMovies = () => {

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const loadWatchedMovies = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Non sei autenticato.");
            return;
          }
  
          const movies = await fetchUserMovies(token, 'to-watch');
          setMovies(movies);
        } catch (err) {
          setError(err.message);
        }
      };
  
      loadWatchedMovies();
    }, []);
  
    if (error) {
      return <p className="error-message">{error}</p>;
    }
  
  return (
    <div className="watched-movies content">
      <h1 className="title">Film Da Vedere</h1>
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id}>
              <img 
                src={movie.movieId.poster_path} 
                alt={movie.movieId.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
                loading="lazy"
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-description">{new Date(movie.movieId.Year).getFullYear()}</p> */}

              <div className="hide-on-mobile">
                <p className="movie-title">{movie.movieId.title}</p>
                <p className="movie-year">{new Date(movie.movieId.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">Non hai ancora aggiunto film da vedere.</p>
      )}
    </div>
  );
  
};

export default ToWatchMovies;
