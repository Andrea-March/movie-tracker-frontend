import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './PersonDetailPopup.css'

const PersonDetailPopup = () => {
    const { selectedPerson, isPersonPopupOpen } = movieStore;
    const topRef = useRef(null);

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const backgroundImage = 
     `linear-gradient(to bottom, rgba(7, 7, 7, 0) 0%, rgba(7, 7, 7, 0.6) 50vh, rgba(7, 7, 7, 1) 70vh), url(https://image.tmdb.org/t/p/original${selectedPerson?.person?.profile_path})`

  return (
    <> 
    {isPersonPopupOpen &&
        <div className="person-popup-overlay">
            <div className="person-popup" style={{
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat"
                /* backdropFilter: 'blur(5px)' */
            }}>
                <FontAwesomeIcon 
                    icon={faTimes} 
                    onClick={() => movieStore.closePersonPopup()} 
                    className="close-popup-btn"
                    ref={topRef}
                />
                <div className='display-flex justify-center'>
                            <h2>{selectedPerson.person.name}</h2>
                </div>
                <div className='person-details display-flex justify-center align-items-center'>
                    <div>
                        <p style={{width: "100%"}}>Born</p>
                        <p style={{width: "100%"}}>{new Date(selectedPerson.person.birthday)
                                .toLocaleDateString("it-IT", {
                                    month: "short",   // Mese abbreviato (Gen, Feb, Mar, Mag…)
                                    day: "numeric",   // Giorno
                                    year: "numeric"   // Anno
                            })}
                        </p>
                    </div>
                    <p>{new Date(selectedPerson.person.birthday).getFullYear()}</p>
                    <div>
                        <p style={{width: "100%"}}>Dead</p>
                        <p style={{width: "100%"}}>{selectedPerson.person.death ? new Date(selectedPerson.person.death)
                                .toLocaleDateString("it-IT", {
                                    month: "short",   // Mese abbreviato (Gen, Feb, Mar, Mag…)
                                    day: "numeric",   // Giorno
                                    year: "numeric"   // Anno
                            }) : "N/A"}
                        </p>
                    </div>
                </div>
                    {selectedPerson.movies.length > 0 && (
                              <div className="known-for-movies-section">
                                <p>Conosciuto per:</p>
                                <div className="known-for-movies-slider">
                                  {selectedPerson.movies.map((movie) => (
                                    <div 
                                      key={movie.id} 
                                      className="known-for-movie-card"
                                      onClick={() => {movieStore.setSelectedMovie(movie); scrollToTop()}} // oppure apri nuovo popup
                                    >
                                      <img 
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                        alt={movie.title} 
                                        loading="lazy"
                                      />
                                      <p>{movie.title}</p> 
                                    </div>
                                  ))}
                                </div>
                              </div>
                    )}
                <div className='display-flex justify-center'>
                    <p className="person-overview">{selectedPerson.person.biography || "Biografia non disponibile."}</p>
                </div>
            </div>

        </div>
    }
    </>
  );
};

export default observer(PersonDetailPopup);