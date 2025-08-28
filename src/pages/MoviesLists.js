import './MoviesLists.css'
import SubNavbar from '../components/SubNavbar'
import { observer } from 'mobx-react-lite'
import { movieStore } from '../stores/MovieStore'
import WatchedMovies from './WatchedMovies'
import ToWatchMovies from './ToWatchMovies'
import Explore from './Explore'
import Searchbar from '../components/Searchbar'

const MoviesLists = () =>{

    const {activePage} = movieStore;

    const renderContent = () => {
        switch (activePage) {
        case 'watched':
            return <WatchedMovies />;
        case 'toWatch':
            return <ToWatchMovies />;
        case 'explore':
            return <Explore />;
        default:
            return null;
        }
    };

    return (
        <>
            <SubNavbar />
            <div>{renderContent()}</div>
        </>
    )
}

export default observer(MoviesLists);