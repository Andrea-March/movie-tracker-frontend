import React, { useEffect } from "react";
import { Slidable } from "../components/Slidable";
import "./WatchedMovies.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";


const WatchedMovies = () => {
  const { watched, loading, loadWatchedMovies, setWatchedPage, setSelectedMovie } = movieStore;

  useEffect(() => {
    loadWatchedMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextPage = () => {
    if (watched.page < watched.totalPages) setWatchedPage(watched.page + 1);
  };

  const handlePreviousPage = () => {
    if (watched.page > 1) setWatchedPage(watched.page - 1);
  };

  return (
    <div className="watched-movies content">
      {loading && <div className="movies-grid-placeholder" />}

      {!loading && watched.movies.length > 0 && (
        <Slidable
          className="movie-grid flex-wrap justify-center"
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
        >
          {watched.movies.map((movie) => {
            const path = movie.movieId?.poster_path || "";
            const title = movie.movieId?.title || "Senza titolo";
            const year = movie.movieId?.release_date
              ? new Date(movie.movieId.release_date).getFullYear()
              : "—";
            const hasPoster = Boolean(path);

            return (
              <div
                className="movie-card"
                key={movie.movieId.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMovie(movie.movieId, "watched")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedMovie(movie.movieId, "watched");
                  }
                }}
                aria-label={`${title}${year !== "—" ? `, ${year}` : ""}`}
              >
                {hasPoster ? (
                  <img
                    srcSet={`https://image.tmdb.org/t/p/w200/${movie.movieId.poster_path.split("/")[6]} 200w, 
                    https://image.tmdb.org/t/p/w400/${movie.movieId.poster_path.split("/")[6]} 400w`} 
                    sizes="(max-width: 768px) 200px, 400px"
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="movie-poster"
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      background: "var(--surface-2)",
                      border: "1px dashed var(--border)",
                      height: "100%",
                      width: "100%",
                      borderRadius: "12px",
                      fontSize: ".85rem",
                      color: "var(--muted)",
                    }}
                  >
                    Nessuna immagine
                  </div>
                )}

                <div className="hide-on-mobile">
                  <p className="movie-title">{title}</p>
                  <p className="movie-year">{year}</p>
                </div>
              </div>
            );
          })}
        </Slidable>
      )}

      {!loading && watched.movies.length < 1 && (
        <p className="no-movies">Non hai ancora aggiunto film visti.</p>
      )}

      <div className="pagination" aria-label="Paginazione film visti">
        <button
          onClick={handlePreviousPage}
          disabled={watched.page === 1}
          className="pagination-button"
          aria-label="Pagina precedente"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span aria-live="polite">
          {watched.page} / {watched.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={watched.page === watched.totalPages}
          className="pagination-button"
          aria-label="Pagina successiva"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default observer(WatchedMovies);