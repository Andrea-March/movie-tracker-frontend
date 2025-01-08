import React, { useEffect, useState } from 'react';
import './MoviePopupDetail.css'; // Puoi aggiungere uno stile per il popup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faPlus, faCheck, faTrash, faE } from "@fortawesome/free-solid-svg-icons";
import { getMovieProviders, searchTrailerurl, deleteMovie } from '../services/movieservice';
import Error from './Error';


const MovieDetailPopup = ({ movie, movieStatus, closePopup, changeMovieStatus }) => {

  const [providers, setProviders] = useState(undefined);
  const [trailerurl, setTrailerUrl] = useState(movie.trailer_url);
  const [error, setError] = useState(null);

  const[showStatusChoice, setShowStatusChoice] = useState(false);

  const wantedProviders = [119, 337, 359, 3, 8, 2, 10, 35, 39, 222, 1726, 188, 109]

  useEffect(()=>{
      const getProviders = async () => {
        try{
          const token = localStorage.getItem("token");
          if (!token) {
            return;
          }
          const provs = await getMovieProviders(token, movie.id);
          setProviders(provs);console.log(provs)
        } catch (err) {
          console.log(err);
        }
      }

      const getTrailerUrl = async () => {
        if(trailerurl){
          return;
        }
        try{
          const url = await searchTrailerurl(movie.id);
          setTrailerUrl(url);
        }catch (err){
          console.log(err.message)
        }

      }

      getProviders();
      getTrailerUrl();

  }
  ,[])


  const handleStatusChange = (status = null) => {
    status ? changeMovieStatus(movie, status) : changeMovieStatus(movie.id)
  };

  const handleMovieDelete = async () => {
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Devi essere loggato per eliminare un film dalla tua lista!");
        return;
      }
      await deleteMovie(token, movie._id);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }

  }

  // Icona basata sullo stato del film
  const statusIcon = movieStatus === 'watched'
      ? faEye // Film visto
      : movieStatus === 'to-watch'
      ? faCheck // Da vedere
      : faPlus; // Modalità esplora

  const statusLabel =  movieStatus === 'watched'
      ? "Segna come da vedere"
      : movieStatus === 'to-watch'
      ? "Segna come visto"
      : "Aggiungi alla lista";
  const backgroundImage = 
     `linear-gradient(to top, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.8) 80%, rgba(0, 0, 0, 0.6) 100%), url(https://image.tmdb.org/t/p/original${movie.poster_path})`

  return (
    <div className="movie-popup-overlay">
      
        <div
          className="movie-popup"
          style={{
            backgroundImage: backgroundImage,
          }}
        >        
        <FontAwesomeIcon icon={faTimes} onClick={closePopup} className="close-popup-btn" />
        <h2>{movie.title}</h2>
        <p><strong>Data di uscita:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
        <p><strong>Descrizione:</strong> {movie.overview}</p>
        <p><strong>Voto:</strong> {movie.vote_average?.toFixed(1) || "?"} / 10</p>

        {trailerurl && 
          <iframe 
            width="100%" 
            height="315" 
            src={trailerurl} 
            loading='lazy'
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        }

       <div className="movie-status flex-column align-items-center">
                    {movieStatus && 
                      <div className='flex-row width-90 justify-between margin-bottom-10'>
                        <div className='flex-row align-items-center'>
                          <FontAwesomeIcon
                            icon={statusIcon}
                            onClick={handleStatusChange}
                            className="status-icon"
                            title={statusLabel}
                          />
                          <span className="status-label padding-left-10">{statusLabel}</span>
                        </div>
                        <FontAwesomeIcon className='delete-icon' size="2x" icon={faTrash} onClick={handleMovieDelete}/>
                      </div>
                    }
                    {!movieStatus && 
                    <div className='add-to-list-container display-flex align-items-center' onClick={()=>{setShowStatusChoice(!showStatusChoice)}}>
                      <FontAwesomeIcon
                        icon={statusIcon}
                        className="status-icon"
                        title={statusLabel}
                      />
                      <span className="status-label padding-left-10">{statusLabel}</span>
                    </div>
                    }
                    {showStatusChoice && 
                      <div className='flex-column status-choice-container'>
                        <div className='flex-row margin-top-10' onClick={()=>{handleStatusChange("watched")}}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="status-icon"
                            title="Segna come visto"
                          />
                          <span className="status-label padding-left-10">Segna come visto</span>
                        </div>
                        <div className='flex-row margin-top-10' onClick={()=>{handleStatusChange("to-watch")}}>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="status-icon"
                            title="Segna come da vedere"
                          />
                          <span className="status-label padding-left-10">Segna come da vedere</span>
                        </div>
                      </div>
                    }
        </div>
        <Error error={error}  setError={setError}/>
          <div className="movie-providers">
            {providers &&
              ["buy", "flatrate", "rent"].map((category) => (
                  <div key={category} className={`provider-category ${category}`}>
                      {providers[category] &&
                        <>
                          <h4>{category === "buy" ? "Compra" : category === "flatrate" ? "Abbonamento" : "Noleggia"}</h4>
                          <div className="provider-logos">
                              {providers[category].map((provider) => (
                                wantedProviders.includes(provider.provider_id) && 
                                <img
                                  key={provider.provider_id}
                                  src={`/provider-logos/${provider.provider_id}.jpg`} // Percorso locale
                                  alt={provider.provider_name}
                                  title={provider.provider_name}
                                  className="provider-logo"
                                />
                              ))}              
                          </div>
                        </>
                      }   
                </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default MovieDetailPopup;