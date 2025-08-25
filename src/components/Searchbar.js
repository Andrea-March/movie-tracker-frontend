import { observer } from 'mobx-react-lite'
import './Searchbar.css'
import { faTimes, faRocket, faFilm, faUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { movieStore } from '../stores/MovieStore';
import { useState, useEffect } from 'react';

const SearchBar = () => {

      const [typingTimeout, setTypingTimeout] = useState(null);
      const {isSearchPopupOpen} = movieStore;
    
      const { search } = movieStore;
      const [query, setQuery] = useState("");
      const [isSearching, setIsSearching] = useState(true);
    
      const DEBOUNCE_TIME_MS = 600;
    
      useEffect(() => {
        // Cleanup il timeout precedente se l'utente continua a scrivere
        return () => clearTimeout(typingTimeout);
      }, [typingTimeout]);
    
      const handleInputChange = (e) => {
        const query = e.target.value;
        setQuery(query);
        clearTimeout(typingTimeout);
    
        setIsSearching(true); // l'utente sta scrivendo
    
        setTypingTimeout(
          setTimeout(async () => {
            await movieStore.searchMulti(query);
            setIsSearching(false); // risultati arrivati
          }, DEBOUNCE_TIME_MS)
        );
      };


    return (
        <>{
          <>
            <div className={`inline-search-bar-container justify-center display-flex ${isSearchPopupOpen ? "open" : "close"}`}>

                <div className="search-bar">
                    <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="back-btn"
                    />
                  <input
                    type="text"
                    placeholder="Cerca un film o una persona..."
                    onChange={handleInputChange}
                    value={query}
                    autoFocus
                  />
    
                  {/* X per cancellare il testo */}
                  {query && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="clear-btn"
                      onClick={() => {setQuery(''); movieStore.resetSearch()}}
                    />
                  )}
                </div>
              <div>
              {search.results.length > 0 && (
                <div className="found-movies-container">
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
                                <FontAwesomeIcon 
                                  icon={item.media_type === "movie" ? faFilm : faUser} 
                                  style={{ marginRight: "5px" }} 
                                />
                                {item.media_type === "movie" ? "Film" : "Persona"}
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
              {!isSearching && search.results.length === 0 && query.trim() && (
                <div className="no-results">
                  <FontAwesomeIcon icon={faRocket} size="3x" className="no-results-icon" />
                  <p className="no-results-text">Ops… il film o la persona che cerchi è nello spazio!</p>
                  <p className="no-results-text-small">Prova a cercare qualcos’altro.</p>
                </div>
              )}
              </div>
            </div>
          </>
      }</>
      );

}

export default observer(SearchBar);