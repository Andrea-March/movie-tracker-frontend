import React, {useEffect, useState} from "react";
import './WatchedMovies.css'
import {searchPopularMovies} from '../services/movieservice'
const Explore = () => {

    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                setError("Non sei autenticato.");
                return;
                }
        
                const movies = await searchPopularMovies(token);
                setPopularMovies(movies);
            } catch (err) {
                setError(err.message);
            }
        };
        
        loadPopularMovies();
    }
    ,[]);

    return(
     <div className="watched-movies content">
      <h1 className="title">Film Popolari</h1>
      {popularMovies.length > 0 ? (
        <div className="movie-grid">
          {popularMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img 
                src={"https://image.tmdb.org/t/p/original"+movie.poster_path} 
                alt={movie.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-year">{new Date(movie.movieId.Year).getFullYear()}</p> */}
              
              <div className="hide-on-mobile">
                <p className="movie-title">{movie.title}</p>
                <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">Non ci sono film da visualizzare.</p>
      )}
    </div>
    );
}

export default Explore;