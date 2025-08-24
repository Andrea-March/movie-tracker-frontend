import React, { useEffect, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MovieSearch.css';
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

function MovieSearch({onCloseClick}) {
  const [typingTimeout, setTypingTimeout] = useState(null);

  const { search } = movieStore;

  const DEBOUNCE_TIME_MS = 600;

  useEffect(() => {
    // Cleanup il timeout precedente se l'utente continua a scrivere
    return () => clearTimeout(typingTimeout);
  }, [typingTimeout]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    clearTimeout(typingTimeout);
    setTypingTimeout(
      /* setTimeout(() => movieStore.searchMovies(query), DEBOUNCE_TIME_MS) */
      setTimeout(() => movieStore.searchMulti(query), DEBOUNCE_TIME_MS)
    );
  };

  return (
    <div className="movie-search-container">
      <div className="flex-row justify-between align-items-center">
        <h1>Ricerca</h1>
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
            {search.results.map((item) => (
              <li
                className="search-result"
                key={`${item.media_type}-${item.id}`}
                onClick={() => {
                    if (item.media_type === "movie") {
                      movieStore.setSelectedMovie(item, undefined);
                    } else if (item.media_type === "person") {
                      movieStore.setSelectedPerson(item);
                    }
                  }}
              >
                  {item.media_type === "movie" && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title}
                      loading="lazy"
                      className="movie-poster-search"
                    />
                  )}
                  {item.media_type === "person" && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.profile_path}`}
                      alt={item.name}
                      loading="lazy"
                      className="person-avatar"
                    />
                  )}
                  <div >
                    <h3 className="movie-title-search">
                      {item.media_type === "movie" 
                        ? `${item.title} ${item.release_date ? `(${item.release_date.slice(0, 4)})` : ""}` 
                        : item.name}
                    </h3>
                    <div className={`badge-tab ${item.media_type === "movie" ? "badge-film" : "badge-person"}`}>
                          {item.media_type === "movie" ? "🎬 Film" : "👤 Persona"}
                    </div>
                  </div>
                <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
               {/*  <FontAwesomeIcon
                      icon={faCheckCircle}
                      onClick={(e) => {movieStore.addMovie(movie, true)}}
                      style={{
                        cursor: "pointer",
                        color: "#4CAF50",
                        fontSize: "24px",
                      }}
                      className="add-icon"
                      title="Aggiungi ai visti"
                /> */}
                  {/*   <FontAwesomeIcon
                      icon={faEye}
                      onClick={(e) => {movieStore.addMovie(movie, false)}}
                      style={{
                        cursor: "pointer",
                        color: "#FF9800",
                        fontSize: "24px",
                      }}
                      title="Aggiungi ai da vedere"
                    /> */}
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