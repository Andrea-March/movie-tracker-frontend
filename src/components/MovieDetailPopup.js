import React, { useEffect, useState } from 'react';
import './MoviePopupDetail.css'; // Puoi aggiungere uno stile per il popup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faCheck, faTrash, faCalendarAlt, faStar, faList, faPlay } from "@fortawesome/free-solid-svg-icons";
import { getMovieProviders, searchTrailerurl, deleteMovie } from '../services/movieservice';
import Error from './Error';


const MovieDetailPopup = ({ movie, movieStatus, closePopup, changeMovieStatus }) => {

  const [providers, setProviders] = useState(undefined);
  const [trailerurl, setTrailerUrl] = useState(movie.trailer_url);
  const [showTrailer, setShowTrailer] = useState(false);
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
          setProviders(provs);
        } catch (err) {
          console.log(err);
        }
      }

      getProviders();
      getTrailerUrl();

  }, []);

  useEffect(()=>{
    if(!showTrailer){
      return;
    }
    getTrailerUrl();
  },[showTrailer])


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

  const handleShowTrailer = () => {
    if(!showTrailer){
      setShowTrailer(true);
    }
  }

  // Icona basata sullo stato del film
  const statusIcon = movieStatus === 'watched'
      ? faEye // Film visto
      : movieStatus === 'to-watch'
      ? faCheck // Da vedere
      : faList; // Modalità esplora

  const statusLabel =  movieStatus === 'watched'
      ? "Segna come da vedere"
      : movieStatus === 'to-watch'
      ? "Segna come visto"
      : "Aggiungi alla lista";
  const backgroundImage = 
     `linear-gradient(to top, rgba(7, 7, 7, 1) 65%, rgba(7, 7, 7, 0.7) 80%, rgba(7, 7, 7, 0.3) 100%), url(https://image.tmdb.org/t/p/original${movie.poster_path})`

  return (
    <div className="movie-popup-overlay">
      
        <div
          className="movie-popup"
          style={{
            backgroundImage: backgroundImage,
            /* backdropFilter: 'blur(5px)' */
          }}
        >        
        <FontAwesomeIcon icon={faTimes} onClick={closePopup} className="close-popup-btn" size="2x" />
        <h2>{movie.title}</h2>
        <div className='movie-details display-flex justify-around align-items-center'>
          <p>{movie.genres[0] || ""}</p>
          <p>{new Date(movie.release_date).getFullYear()}</p>
          <p>{movie.runtime} min</p>
        </div>
        <p className='movie-overview'>{movie.overview}</p>
        <div className='display-flex justify-center align-items-center'>
          <FontAwesomeIcon icon={faStar} className="detail-star-icon" size={"xl"}/>
          <div className='movie-vote-container display-flex flex-row align-items-center'>
            <p>{movie.vote_average?.toFixed(1) ? movie.vote_average.toFixed(1): "not rated"}</p>
            <p>&nbsp;&nbsp;/10</p>
          </div>
        </div>

        <div className='section-divider'></div>
        <div className="movie-status flex-column align-items-center">
                    {movieStatus && 
                      <div className='flex-row width-90 justify-between margin-bottom-10'>
                        <div className='flex-column align-items-center width-50'>
                          <FontAwesomeIcon
                            icon={statusIcon}
                            onClick={handleStatusChange}
                            className="status-icon"
                            title={statusLabel}
                          />
                          <span className="status-label padding-left-10">{statusLabel}</span>
                        </div>
                        <div className='flex-column align-items-center width-50'>
                          <FontAwesomeIcon 
                            className='delete-icon width-30' 
                            size="lg" 
                            icon={faTrash} 
                            onClick={handleMovieDelete}
                          />
                          <span className="status-label padding-left-10">Elimina dalla lista</span>
                        </div>
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
                      <div className="flex-column status-choice-container">
                        <div className='flex-row margin-top-20' onClick={()=>{handleStatusChange("watched")}}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="status-icon"
                            title="Segna come visto"
                          />
                          <span className="status-label padding-left-10">Segna come visto</span>
                        </div>
                        <div className='flex-row margin-top-20' onClick={()=>{handleStatusChange("to-watch")}}>
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
        <div className='section-divider'></div>
        {
          !showTrailer && 
          <div 
            style={{width: "100%", height: "315px"}} 
            className='flex-column justify-center align-items-center'
            onClick={()=>{handleShowTrailer()}} 
          >           
            {/* <FontAwesomeIcon 
              icon={faPlay} 
              size="2x" 
              onClick={()=>{
                if(!showTrailer){
                  setShowTrailer(true);
                }
              }} 
              style={{color:"#79DBFF"}}/> */}
              <svg xmlns="http://www.w3.org/2000/svg" height="60" width="68" viewBox="0 0 576 512"><path fill="#79dbff" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
            <p>Guarda il trailer</p>
         </div>
        }
        {trailerurl && showTrailer && 
          <iframe 
            width="100%" 
            height="315" 
            src={`${trailerurl}?autoplay=1&rel=0&modestbranding=1&controls=1&autohide=1&showinfo=0`} 
            loading='lazy'
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            style={{marginTop: '20px'}}
          ></iframe>
        }
        {!trailerurl && showTrailer && <p className="no-providers">Trailer non disponibile per questo film</p>}

        <div className='section-divider'></div>
        <Error error={error}  setError={setError}/>
        {providers &&
          <div>
            {
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
                                  loading='lazy'
                                />
                              ))}          
                          </div>
                        </>
                      }   
                  </div>
                ))}
            </div>
        }
        {
          !providers && 
            <p className="no-providers">Ancora nessun provider disponibile per questo film</p>
        }
          
      </div>
    </div>
  );
};

export default MovieDetailPopup;