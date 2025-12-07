import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import { getMovieProviders } from '../../services/movieservice';
import { stateStore } from '../../stores/StateStore';

const GroupMovieDetail = ({movie, setShowMovieDetail}) => {

    const {setError, startLoading, stopLoading} = stateStore;

    const [showTrailer, setShowTrailer] = useState(false);
    const [providers, setProviders] = useState([]);

  const wantedProviders = [119, 337, 359, 3, 8, 2, 10, 35, 39, 222, 1726, 188, 109];

 

    const fetchMovieDetails = async () => {
          startLoading();
          if (!movie) {
              return;
          }
          try {
              const token = localStorage.getItem("token");
  
          // Carica providers
          if (token) {
              try {
                  const provs =  await getMovieProviders(token, movie.tmdbId);
                  setProviders(provs);
              } catch (err) {
                  console.error("Errore caricamento dettagli film:", err.message);
              }
          }  
          } catch (err) {
              setError(err.message)
          } finally {
            stopLoading();
          }
    }

    useEffect(()=>{fetchMovieDetails()}, [movie])
  


  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` :  `${mins}m`;
  }


  const backgroundImage = 
     `linear-gradient(to bottom, rgba(7, 7, 7, 0) 0%, rgba(7, 7, 7, 0.6) 30vh, rgba(7, 7, 7, 1) 50vh), url(${movie?.poster})`

  return (
    <>
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
          <FontAwesomeIcon icon={faTimes} onClick={()=>{setShowMovieDetail(false)}} className="close-popup-btn"/>
          <div className='display-flex justify-center'>
            <h2>{movie.title}</h2>
          </div>
          <div className='movie-details display-flex justify-center align-items-center'>
            <p>{movie.genres ? movie.genres[1] || movie.genres[0] : ""}</p>
            <p>{movie.year}</p>
            <p>{movie.runtime? formatDuration(movie.runtime) : ""}</p>
          </div>
          <div className='display-flex justify-center'>
             <p className="movie-overview">{movie.overview}</p>
          </div>
         
          <div className='display-flex justify-center align-items-center'>
            <FontAwesomeIcon icon={faStar} className="detail-star-icon" size={"xl"}/>
            <div className='movie-vote-container display-flex flex-row align-items-center'>
              <p>{movie.vote_average?.toFixed(1) ? movie.vote_average.toFixed(1): "not rated"}</p>
              <p>&nbsp;/10</p>
            </div>
        </div>
              
         <div className='section-divider'></div> 
        {
          !showTrailer && 
          <div 
            style={{width: "100%", paddingTop: "20px"}} 
            className='flex-column justify-center align-items-center'
            onClick={()=>{setShowTrailer(true)}} 
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
        {movie.trailer_url && showTrailer && 
          <iframe 
            width="100%" 
            height="500" 
            src={`${movie.trailer_url}?autoplay=1&rel=0&modestbranding=1&controls=1&autohide=1&showinfo=0`} 
            loading='lazy'
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            style={{marginTop: '20px'}}
          ></iframe>
        }
        {!movie.trailer_url && showTrailer  && <p className="no-providers">Trailer non disponibile per questo film</p>}

        <div className='section-divider'></div>
        {providers &&
          <div className='providers-container'>
            {
              ["buy", "flatrate", "rent"].map((category) => (
                  <div key={category} className={`provider-category ${category}`}>
                      {providers[category] &&
                        <>
                          <h4 key={category}>{category === "buy" ? "Compra" : category === "flatrate" ? "Abbonamento" : "Noleggia"}</h4>
                          <div className="provider-logos flex-wrap">
                              {providers[category].map((provider) => (
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
          !providers && 
            <p className="no-providers">Ancora nessun provider disponibile per questo film</p>
        }
        <div className='section-divider'></div>
        
            
      </div>
    </div>
    </div>
      </>
  );

};

export default GroupMovieDetail;