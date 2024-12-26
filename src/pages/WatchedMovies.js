import React, { useEffect, useState } from "react";
import { fetchUserMovies } from "../services/movieservice";
import "./WatchedMovies.css"; // File CSS dedicato

const WatchedMovies = () => {
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

        const userMovies = await fetchUserMovies(token);
        const watchedMovies = userMovies.filter((movie) => movie.watched);
        setMovies(watchedMovies);
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
      <h1 className="title">Film Visti</h1>
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id}>
              <img 
                src={movie.movieId.poster_path} 
                alt={movie.movieId.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-description">{new Date(movie.movieId.Year).getFullYear()}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">Non hai ancora aggiunto film visti.</p>
      )}
    </div>
  );
};

export default WatchedMovies;