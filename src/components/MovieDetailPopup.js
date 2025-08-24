import React, { useState, useRef } from 'react';
import './MoviePopupDetail.css'; // Puoi aggiungere uno stile per il popup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faCheck, faTrash, faStar, faList } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";


const MovieDetailPopup = () => {

  const[showStatusChoice, setShowStatusChoice] = useState(false);

  const topRef = useRef(null);

  const wantedProviders = [119, 337, 359, 3, 8, 2, 10, 35, 39, 222, 1726, 188, 109];
  const {selectedMovie} = movieStore;

  const handleStatusChange = () => {
     movieStore.changeStatus()
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` :  `${mins}m`;
  }

  // Icona basata sullo stato del film
  const statusIcon = selectedMovie.status === 'watched'
      ? faEye // Film visto
      : selectedMovie.status === 'to-watch'
      ? faCheck // Da vedere
      : faList; // Modalità esplora

  const statusLabel =  selectedMovie.status === 'watched'
      ? "Segna come da vedere"
      : selectedMovie.status === 'to-watch'
      ? "Segna come visto"
      : "Aggiungi alla lista";
  const backgroundImage = 
     `linear-gradient(to bottom, rgba(7, 7, 7, 0) 0%, rgba(7, 7, 7, 0.6) 30vh, rgba(7, 7, 7, 1) 50vh), url(https://image.tmdb.org/t/p/original${selectedMovie?.movie?.poster_path})`

  return (
    <>{ movieStore.isPopupOpen &&
    <div className='movie-popup-border-desktop'>
    <div className="movie-popup-overlay">
      
        <div
          className="movie-popup"
          style={{
            backgroundImage: backgroundImage,
            backgroundRepeat: "no-repeat"
            /* backdropFilter: 'blur(5px)' */
          }}
        >        
          <FontAwesomeIcon icon={faTimes} onClick={()=>{movieStore.closePopup()}} className="close-popup-btn"  ref={topRef}/>
          <div className='display-flex justify-center'>
            <h2>{selectedMovie.movie.title}</h2>
          </div>
          <div className='movie-details display-flex justify-center align-items-center'>
            <p>{selectedMovie.movie.genres ? selectedMovie.movie.genres[1] || selectedMovie.movie.genres[0] : ""}</p>
            <p>{new Date(selectedMovie.movie.release_date).getFullYear()}</p>
            <p>{selectedMovie.movie.runtime? formatDuration(selectedMovie.movie.runtime) : ""}</p>
          </div>
          <div className='display-flex justify-center'>
             <p className="movie-overview">{selectedMovie.movie.overview}</p>
          </div>
         
          <div className='display-flex justify-center align-items-center'>
            <FontAwesomeIcon icon={faStar} className="detail-star-icon" size={"xl"}/>
            <div className='movie-vote-container display-flex flex-row align-items-center'>
              <p>{selectedMovie.movie.vote_average?.toFixed(1) ? selectedMovie.movie.vote_average.toFixed(1): "not rated"}</p>
              <p>&nbsp;/10</p>
            </div>
        </div>

        <div className='section-divider'></div>

        
        <div className="movie-status display-flex justify-center align-items-center">
                    {selectedMovie.status && 
                      <div className='flex-row width-90 justify-between margin-bottom-10'>
                        <div className='flex-column align-items-center width-50 gap-10'>
                          <FontAwesomeIcon
                            icon={statusIcon}
                            onClick={handleStatusChange}
                            className="status-icon"
                            title={statusLabel}
                          />
                          <span className="status-label padding-left-10">{statusLabel}</span>
                        </div>
                        <div className='flex-column align-items-center width-50 gap-10'>
                          <FontAwesomeIcon 
                            className='delete-icon width-30' 
                            size="lg" 
                            icon={faTrash} 
                            onClick={()=>{movieStore.deleteMovie()}}
                          />
                          <span className="status-label padding-left-10">Elimina dalla lista</span>
                        </div>
                      </div>
                    }
                    {!selectedMovie.status &&
                    <div className='display-flex align-items-center' onClick={()=>{setShowStatusChoice(!showStatusChoice)}}>
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
                        <div className='flex-row margin-top-20' onClick={()=>{movieStore.addMovie(selectedMovie.movie, true); setShowStatusChoice(false)}}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="status-icon"
                            title="Segna come visto"
                          />
                          <span className="status-label padding-left-10">Segna come visto</span>
                        </div>
                        <div className='flex-row margin-top-20' onClick={()=>{movieStore.addMovie(selectedMovie.movie, false); setShowStatusChoice(false)}}>
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
          !selectedMovie.showTrailer && 
          <div 
            style={{width: "100%", paddingTop: "20px"}} 
            className='flex-column justify-center align-items-center'
            onClick={()=>{movieStore.toggleTrailer()}} 
          >           
              <svg xmlns="http://www.w3.org/2000/svg" height="60" width="68" viewBox="0 0 576 512">
                
                <path 
                  fill="#00bfff" 
                  d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3z"
                />
                <path 
                  fill="#fff" 
                  d="M232.2 337.6V174.4L374.9 256l-142.7 81.6z"
                />
              </svg> 
            
              <p>Guarda il trailer</p>
         </div>
        }
        {selectedMovie.trailerUrl && selectedMovie.showTrailer && 
          <iframe 
            width="100%" 
            height="500" 
            src={`${selectedMovie.trailerUrl}?autoplay=1&rel=0&modestbranding=1&controls=1&autohide=1&showinfo=0`} 
            loading='lazy'
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            style={{marginTop: '20px'}}
          ></iframe>
        }
        {!selectedMovie.trailerUrl && selectedMovie.showTrailer  && <p className="no-providers">Trailer non disponibile per questo film</p>}

        <div className='section-divider'></div>
        {selectedMovie.providers &&
          <div className='providers-container'>
            {
              ["buy", "flatrate", "rent"].map((category) => (
                  <div key={category} className={`provider-category ${category}`}>
                      {selectedMovie.providers[category] &&
                        <>
                          <h4 key={category}>{category === "buy" ? "Compra" : category === "flatrate" ? "Abbonamento" : "Noleggia"}</h4>
                          <div className="provider-logos">
                              {selectedMovie.providers[category].map((provider) => (
                                wantedProviders.includes(provider.provider_id) && 
                                (<div className='provider-card flex-column align-items-center' key={provider.provider_id+"_div"}>
                                  <img
                                    key={provider.provider_id}
                                    src={`/provider-logos/${provider.provider_id}.jpg`} // Percorso locale
                                    alt={provider.provider_name}
                                    title={provider.provider_name}
                                    className="provider-logo"
                                    loading='lazy'
                                  />
                                  <p className='width-90'>{provider.provider_name.split(" ").slice(0,2).join(" ")}</p>
                                </div>)
                              ))}          
                          </div>
                        </>
                      }   
                  </div>
                ))}
            </div>
        }
        {
          !selectedMovie.providers && 
            <p className="no-providers">Ancora nessun provider disponibile per questo film</p>
        }
        <div className='section-divider'></div>
         {/* Sezione Film Correlati */}
        {selectedMovie.relatedMovies && selectedMovie.relatedMovies.length > 0 && (
          <div className="related-movies-section">
            <h3>Film correlati</h3>
            <div className="related-movies-slider">
              {selectedMovie.relatedMovies.map((rm) => (
                <div 
                  key={rm.id} 
                  className="related-movie-card"
                  onClick={() => {movieStore.setSelectedMovie(rm); scrollToTop()}} // oppure apri nuovo popup
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${rm.poster_path}`} 
                    alt={rm.title} 
                    loading="lazy"
                  />
                  {/* <p>{rm.title}</p> */}
                </div>
              ))}
            </div>
          </div>
        )}
            
      </div>
    </div>
    </div>
    }
      </>
  );

};

export default observer(MovieDetailPopup);