import React, { useEffect, useState } from "react";
import { faCheckCircle, faEye, faTimes } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MovieSearch.css';
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

function MovieSearch({onCloseClick}) {
  const [typingTimeout, setTypingTimeout] = useState(null);

  const { search } = movieStore;

  const DEBOUNCE_TIME_MS = 500;

  useEffect(() => {
    // Cleanup il timeout precedente se l'utente continua a scrivere
    return () => clearTimeout(typingTimeout);
  }, [typingTimeout]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => movieStore.searchMovies(query), DEBOUNCE_TIME_MS)
    );
  };

  return (
    <div className="movie-search-container">
      <div className="flex-row justify-between align-items-center">
        <h1>Ricerca Film</h1>
        <FontAwesomeIcon className="close-search-bar-icon" icon={faTimes} size="2x" onClick={onCloseClick}/>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Cerca un film..."
          onChange={handleInputChange}
        />
          
      </div>
      <div>
      {search.results.length > 0 && (
        <div className="found-movies-container">
          <h2>Risultati della ricerca:</h2>
          <ul style={{ listStyle: "none", padding: 0 }} className="search-results-list">
            {search.results.map((movie) => (
              <li
                className="search-result"
                key={movie.id}
              >
                  {movie.poster_path && (
                    <img
                      onClick={()=>{movieStore.setSelectedMovie(movie, undefined)}}
                      src={"https://image.tmdb.org/t/p/original"+movie.poster_path}
                      alt={movie.title}
                      loading="lazy"
                    />
                  )}
                  <div onClick={()=>{movieStore.setSelectedMovie(movie, undefined)}}>
                    <h3 style={{ margin: 0 }} className="movie-title-search">
                      {movie.title}{" "}
                      {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
                    </h3>
                  </div>
                <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                <FontAwesomeIcon
                      icon={faCheckCircle}
                      onClick={(e) => {movieStore.addMovie(movie, true)}}
                      style={{
                        cursor: "pointer",
                        color: "#4CAF50",
                        fontSize: "24px",
                      }}
                      className="add-icon"
                      title="Aggiungi ai visti"
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={(e) => {movieStore.addMovie(movie, false)}}
                      style={{
                        cursor: "pointer",
                        color: "#FF9800",
                        fontSize: "24px",
                      }}
                      title="Aggiungi ai da vedere"
                    />
                  </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

export default observer(MovieSearch);