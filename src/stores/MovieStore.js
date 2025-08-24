// src/stores/MovieStore.js
import { makeAutoObservable, runInAction } from "mobx";
import { fetchUserMovies, changeMovieStatus } from "../services/movieservice";
import { addMovieToList, searchMovies } from "../services/movieservice";
import { getMovieProviders, getRelatedMovies, searchTrailerurl, deleteMovie, searchPopularMovies, searchTopRatedMovies, searchUpcomingMovies, searchMulti } from "../services/movieservice";
import { getPersonMovies } from "../services/personsService";
class MovieStore {
    watched = { movies: [], page: 1, totalPages: undefined};
    toWatch = { movies: [], page: 1, totalPages: undefined };
    popular = { movies: [], filter: "popular", page: 1, totalPages: undefined };

    search = {query: "", results: [], error: "",};

    successMessage = "";  
    error = "";

    loading = false;

    selectedMovie = {
        movie: null,          // l’oggetto film
        providers: null,      // dati providers
        relatedMovies: null,  // film correlati
        trailerUrl: null,     // trailer
        showTrailer: false,   // booleano
        status: undefined     // string watched or to-watch
    }

    selectedPerson = {
        person: null,        // oggetto persona
        movies: []
    }

    isPersonPopupOpen = false;
    isPopupOpen = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }


    async loadWatchedMovies() {
        this.loading = true;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Non sei autenticato.");
            const res = await fetchUserMovies(token, "watched", this.watched.page, !this.watched.totalPages);
            runInAction(() => {
                this.watched.movies = res.movies;
                if(!this.watched.totalPages){this.watched.totalPages = res.totalPages;}
            });
        } catch (err) {
            runInAction(() => { this.error = err.message; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async loadToWatchMovies () {
        this.loading=true;
        try {
            const token = localStorage.getItem("token");
            if (!token)  throw new Error("Non sei autenticato.");
            const res = await fetchUserMovies(token, 'to-watch', this.toWatch.page, !this.toWatch.totalPages);
            runInAction(() => {
                    this.toWatch.movies = res.movies;
                    if(!this.toWatch.totalPages){this.toWatch.totalPages = res.totalPages;}
            });
        } catch (err) {
            runInAction(() => { this.error = err.message; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    };

    async loadPopularMovies () {
        this.loading = true;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Non sei autenticato.")
            const res =
            this.popular.filter === "popular"
                ? await searchPopularMovies(this.popular.page)
                : this.popular.filter === "top_rated" ? await searchTopRatedMovies(this.popular.page) 
                : await searchUpcomingMovies(this.popular.page)
             runInAction(() => {
                this.popular.movies = res.movies;
                if(!this.popular.totalPages){this.popular.totalPages = res.totalPages;}
            });
        } catch (err) {
             runInAction(() => { this.error = err.message; });
        }finally{
            runInAction(() => { this.loading = false; });
        }
    };
    
    setPopularFilter (newFilter){
        this.popular.page = 1;
        this.popular.totalPages = undefined;
        this.popular.filter = newFilter;
        this.loadPopularMovies()
    }

    setWatchedPage(page) {
        this.watched.page = page;
        this.loadWatchedMovies();
    }

    
    setToWatchPage(page) {
        this.toWatch.page = page;
        this.loadToWatchMovies();
    }

    setPopularPage(page) {
        this.popular.page = page;
        this.loadPopularMovies();
    }

    setSelectedMovie = async (movieObj, status) => {
        if (!movieObj) {
            // Chiude il popup
            this.selectedMovie = null;
            return;
        }

        // Inizializza l’oggetto selectedMovie
        this.selectedMovie = {
            movie: movieObj,
            providers: null,
            relatedMovies: null,
            trailerUrl: null,
            showTrailer: false,
            status: status
        };

        try {
        const token = localStorage.getItem("token");

        // Carica providers
        if (token) {
            const provs = await getMovieProviders(token, movieObj.id);
            runInAction(() => {
            if (this.selectedMovie?.movie?.id === movieObj.id) {
                this.selectedMovie.providers = provs;
            }
            });
        }

        // Carica film correlati
        const related = await getRelatedMovies(movieObj.id);
        runInAction(() => {
            if (this.selectedMovie?.movie?.id === movieObj.id) {
            this.selectedMovie.relatedMovies = related;
            }
        });

        // Carica trailer
        try{
            const trailer = await searchTrailerurl(movieObj.id);
            runInAction(() => {
                if (this.selectedMovie?.movie?.id === movieObj.id) {
                    this.selectedMovie.trailerUrl = trailer;
                }
        });
        }catch{}
        this.openPopup()
        } catch (err) {
            runInAction(() => {
                this.error = err.message;
            });
        }
    }

    setSelectedPerson = async (personObj) => {
        if (!personObj) {
            this.selectedPerson = null;
            this.isPersonPopupOpen = false;
            return;
        }
        this.selectedPerson = { 
            person: personObj,
            movies: [],
        };
        try {
            let personRole = personObj.known_for_department === "Directing" ? "Director" : "Crew"
            const response = await getPersonMovies(personObj.id, personRole);
            runInAction(() => {
                this.selectedPerson.person = response.personDetail;
                this.selectedPerson.movies = response.credits;
            });
        } catch (err) {
            runInAction(() => {
                console.error(err);
            });
        }
        this.openPersonPopup();
    }

    async searchMovies(query) {
        try {
            if (!query.trim()) {
                this.search.results = [];
                return;
            }
            const data = await searchMovies(query);
                runInAction(() => {
                this.search.results = data;
            });
        } catch (err) {
            runInAction(() => {
                this.setError("Errore durante la ricerca. Riprova.");
            });
        } 
    }

    async searchMulti(query) {
        if (!query.trim()) {
            this.search = { results: [] };
            return;
        }

        try {
             if (!query.trim()) {
                this.search.results = [];
                return;
            }
            const data = await searchMulti(query);
                runInAction(() => {
                this.search.results = data;
            });
        } catch (error) {
            runInAction(() => {
                this.setError("Errore durante la ricerca. Riprova.");
            });
        }
    }
    async addMovie(movie, watched) {
        try {
            await addMovieToList(movie, watched);
            if(watched) {
                this.loadWatchedMovies();
            }else this.loadToWatchMovies();
            
            runInAction(() => {
                this.setSuccess("Film aggiunto!");
            });
        } catch (err) {
            runInAction(() => {
                this.setError(err.message);
            });
        }
    } 

    async deleteMovie() {
        try{
            const token = localStorage.getItem("token");
            if (!token) {
                runInAction(() => {
                this.error = "Devi essere loggato per eliminare un film dalla tua lista!";
                });
                return;
            }
            await deleteMovie(token, this.selectedMovie.movie._id);
            this.successMessage = "Film eliminato dalla lista!";
        } catch (err) {
            runInAction(() => {
                this.error = err.message;
            });
        } finally{
              runInAction(() => {
                if(this.selectedMovie.status === "watched"){this.loadWatchedMovies()}
                else{this.loadToWatchMovies()}
                this.closePopup();
        });
        }
    }


    toggleTrailer = () => {
        if (this.selectedMovie) {
        this.selectedMovie.showTrailer = !this.selectedMovie.showTrailer;
        }
    }

    
    openPopup(){
        this.isPopupOpen= true;
    }

    openPersonPopup(){
        this.isPersonPopupOpen = true;
    }

    closePopup() {
        this.isPopupOpen = false;
        this.selectedMovie = {};
    }

    closePersonPopup() {
        this.isPersonPopupOpen = false;
        this.selectedPerson = {};
    }

    async setFilter (filter) {
        this.popular.filter = filter;
        this.popular.totalPages = undefined;
        this.popular.page = 1;
        this.popular.movies = []
        this.loadPopularMovies()
    }

    async changeStatus() {
        this.watched.loading = true;
        const watched = this.selectedMovie.status === 'watched' ? true : false;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Non sei autenticato.");
            await changeMovieStatus(token, this.selectedMovie.movie._id, !watched);
            this.selectedMovie.status = watched ? "to-watch" : "watched"
            this.setSuccess("Film aggiornato!")
            this.loadWatchedMovies();
            this.loadToWatchMovies();
        } catch (err) {
            runInAction(() => { this.setError(err.message); });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    setSuccess(msg) { this.successMessage = msg }
    clearSuccess() { this.successMessage = "" }
    setError(msg) { this.error = msg }
    clearError() { this.error = "" }
}

export const movieStore = new MovieStore();
