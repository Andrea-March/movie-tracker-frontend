// src/stores/MovieStore.js
import { makeAutoObservable, runInAction } from "mobx";
import { fetchUserMovies, changeMovieStatus } from "../services/movieservice";
import { addMovieToList, searchMovies } from "../services/movieservice";
import { getMovieProviders, getRelatedMovies, searchTrailerurl, deleteMovie, searchPopularMovies, searchTopRatedMovies, searchUpcomingMovies, searchMulti, getGenresAndRuntime } from "../services/movieservice";
import { getPersonMovies } from "../services/personsService";
import { stateStore } from "./StateStore";

const {startLoading, stopLoading, setError, setSuccess, clearError, clearSuccess } = stateStore;

class MovieStore {

 

    activePage = 'watched'
    watched = { movies: [], page: 1, totalPages: undefined};
    toWatch = { movies: [], page: 1, totalPages: undefined };
    popular = { movies: [], filter: "popular", page: 1, totalPages: undefined };

    search = {query: "", results: [], error: "",};

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
    isSearchPopupOpen = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }


    async loadWatchedMovies() {
        startLoading();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Non sei autenticato.");
            const res = await fetchUserMovies(token, "watched", this.watched.page, !this.watched.totalPages);
            runInAction(() => {
                this.watched.movies = res.movies;
                if(!this.watched.totalPages){this.watched.totalPages = res.totalPages;}
            });
        } catch (err) {
            runInAction(() => { setError(err.message) });
        } finally {
            runInAction(() => { stopLoading() });
        }
    }

    async loadToWatchMovies () {
        startLoading()
        try {
            const token = localStorage.getItem("token");
            if (!token)  throw new Error("Non sei autenticato.");
            const res = await fetchUserMovies(token, 'to-watch', this.toWatch.page, !this.toWatch.totalPages);
            runInAction(() => {
                    this.toWatch.movies = res.movies;
                    if(!this.toWatch.totalPages){this.toWatch.totalPages = res.totalPages;}
            });
        } catch (err) {
            runInAction(() => { setError(err.message) });
        } finally {
            runInAction(() => { stopLoading() });
        }
    };

    async loadPopularMovies () {
        startLoading()
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
             runInAction(() => { setError(err.message) });
        }finally{
            runInAction(() => { stopLoading() });
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
        startLoading();
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
        this.selectedMovie.movie.tmdbId = movieObj.id;

        try {
            const token = localStorage.getItem("token");

        // Carica providers
        if (token) {
            try {
                const providersPromise = getMovieProviders(token, movieObj.id);
                const relatedPromise = getRelatedMovies(movieObj.id);
                const trailerPromise = searchTrailerurl(movieObj.id);
                const genreRuntimePromise = getGenresAndRuntime(movieObj.id)
                const [provs, related, trailer, {genres, runtime}] = await Promise.all([providersPromise, relatedPromise, trailerPromise, genreRuntimePromise]);
                
                runInAction(() => {
                    if (this.selectedMovie?.movie?.id === movieObj.id) {
                        this.selectedMovie.providers = provs;
                        this.selectedMovie.relatedMovies = related;
                        this.selectedMovie.movie.trailerUrl = trailer;
                        this.selectedMovie.trailerUrl = trailer;
                        this.selectedMovie.movie.genres = genres;
                        this.selectedMovie.movie.runtime = runtime;
                    }
                });
                console.log(this.selectedMovie)
            } catch (err) {
                console.error("Errore caricamento dettagli film:", err.message);
            }
        }

        this.openPopup()

        } catch (err) {
            runInAction(() => {
                setError(err.message)
            });
        } finally {
            stopLoading();
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
                setError("Errore durante la ricerca. Riprova.");
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
                setError("Errore durante la ricerca. Riprova.");
            });
        }
    }
    async addMovie(movie, watched) {
        console.log(movie, watched)
        try {
            await addMovieToList(movie, watched);
            if(watched) {
                this.loadWatchedMovies();
            }else this.loadToWatchMovies();
            
            runInAction(() => {
                setSuccess("Film aggiunto!");
            });
        } catch (err) {
            runInAction(() => {
                setError(err.message);
            });
        }
    } 

    async deleteMovie() {
        try{
            const token = localStorage.getItem("token");
            if (!token) {
                runInAction(() => {
                setError("Devi essere loggato per eliminare un film dalla tua lista!");
                });
                return;
            }
            await deleteMovie(token, this.selectedMovie.movie._id);
            setSuccess("Film eliminato dalla lista!");
        } catch (err) {
            runInAction(() => {
                setError(err.message)
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
        this.selectedPerson = {};
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
            setSuccess("Film aggiornato!")
            this.loadWatchedMovies();
            this.loadToWatchMovies();
        } catch (err) {
            runInAction(() => { setError(err.message); });
        } finally {
            runInAction(() => { stopLoading()});
        }
    }


    resetSearch(){ this.search = {query: "", results: [], error: "",} }
    showSearchPopup(){ this.isSearchPopupOpen=true }
    hideSearchPopup(){ this.isSearchPopupOpen=false; this.resetSearch() }
    setActivePage(page){ this.activePage = page }
}

export const movieStore = new MovieStore();
