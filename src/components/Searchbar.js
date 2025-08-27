import { observer } from "mobx-react-lite";
import "./Searchbar.css";
import {
  faTimes,
  faRocket,
  faFilm,
  faUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { movieStore } from "../stores/MovieStore";
import { useState, useEffect, useRef, useCallback } from "react";

/** Util per immagini TMDB */
const TMDB = {
  base: "https://image.tmdb.org/t/p/",
  srcset: (path) => `${TMDB.base}w200${path} 200w, ${TMDB.base}w400${path} 400w`,
  url: (path, size = "w200") => `${TMDB.base}${size}${path}`,
};

const MIN_QUERY = 2;         // sotto questa lunghezza non cerchiamo
const DEBOUNCE_TIME_MS = 600;

const SearchBar = () => {
  const { isSearchPopupOpen, search, setSelectedMovie, setSelectedPerson } = movieStore;

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(true);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // cleanup su unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const runSearch = useCallback(async (q) => {
    if (!q || q.trim().length < MIN_QUERY) {
      movieStore.resetSearch();
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    await movieStore.searchMulti(q.trim());
    setIsSearching(false);
  }, []);

  const handleInputChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => runSearch(q), DEBOUNCE_TIME_MS);
  };

  const handleClear = () => {
    setQuery("");
    setIsSearching(false);
    movieStore.resetSearch();
    // facoltativo: rifocus sul campo
    if (inputRef.current) inputRef.current.focus();
  };

  // Enter sui risultati
  const handleResultKeyDown = (e, onActivate) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`inline-search-bar-container justify-center display-flex ${
        isSearchPopupOpen ? "open" : "close"
      }`}
    >
      <form className="search-bar" role="search" >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="back-btn" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cerca un film o una persona..."
          onChange={handleInputChange}
          value={query}
          autoFocus
          aria-label="Cerca"
        />

        {query && (
          <button
            type="button"
            className="clear-btn clear-btn-button"
            onClick={handleClear}
            aria-label="Pulisci ricerca"
            title="Pulisci"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </form>

      <div>
        {search.results.length > 0 && (
          <div className="found-movies-container" role="listbox" aria-label="Risultati della ricerca">
            <ul className="search-results-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {search.results.map((item) => {
                const isMovie = item.media_type === "movie";
                const imgPath = isMovie ? item.poster_path : item.profile_path;
                const title = isMovie
                  ? `${item.title || "Senza titolo"}${
                      item.release_date ? ` (${item.release_date.slice(0, 4)})` : ""
                    }`
                  : item.name || "Senza nome";

                const onActivate = () => {
                  if (isMovie) {
                    handleClear()
                    setSelectedMovie(item, undefined);
                  } else {
                    handleClear()
                    setSelectedPerson(item);
                  }
                };

                return (
                  <li
                    key={`${item.media_type}-${item.id}`}
                    className="search-result"
                    role="option"
                    tabIndex={0}
                    onClick={onActivate}
                    onKeyDown={(e) => handleResultKeyDown(e, onActivate)}
                    aria-label={title}
                  >
                    {imgPath ? (
                      <img
                        srcSet={TMDB.srcset(imgPath)}
                        sizes="(max-width: 768px) 80px, 120px"
                        src={TMDB.url(imgPath, "w200")}
                        alt={title}
                        loading="lazy"
                        className={isMovie ? "movie-poster-search" : "person-avatar"}
                      />
                    ) : (
                      <div
                        className={isMovie ? "movie-poster-search" : "person-avatar"}
                        aria-hidden="true"
                        style={{
                          display: "grid",
                          placeItems: "center",
                          background: "var(--surface-2, rgba(255,255,255,0.06))",
                          border: "1px dashed var(--border, rgba(255,255,255,0.15))",
                          fontSize: ".75rem",
                          color: "var(--muted, #9aa5b1)",
                        }}
                      >
                        —
                      </div>
                    )}

                    <div className="search-result-content">
                      <h3 className="movie-title-search">{title}</h3>
                    </div>

                    <div className={`badge-tab ${isMovie ? "badge-film" : "badge-person"}`}>
                      <FontAwesomeIcon icon={isMovie ? faFilm : faUser} />
                      {isMovie ? "Film" : "Persona"}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {!isSearching && search.results.length === 0 && query.trim().length >= MIN_QUERY && (
          <div className="no-results" role="status" aria-live="polite">
            <FontAwesomeIcon icon={faRocket} size="3x" className="no-results-icon" />
            <p className="no-results-text">Ops… il film o la persona che cerchi è nello spazio!</p>
            <p className="no-results-text-small">Prova a cercare qualcos’altro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(SearchBar);