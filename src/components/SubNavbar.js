import './SubNavbar.css'
import { movieStore } from "../stores/MovieStore";
import { observer } from 'mobx-react-lite';

const SubNavbar = () => {

    const {activePage} = movieStore;

    return (
        <div className="sub-navbar">
            <button
                style={{minWidth: "91px"}}
                className={activePage === "explore" ? "active" : ""}
                onClick={() => {movieStore.setActivePage("explore")}}
            >
                Esplora
            </button>
            <button
                className={activePage === "watched" || activePage === "/" ? "active" : ""}
                onClick={() => {movieStore.setActivePage("watched")}}
            >
                Film Visti
            </button>
            <button
                className={activePage === "toWatch"  ? "active" : ""}
                onClick={() => {movieStore.setActivePage("toWatch")}}
            >
                Da Vedere
            </button>
        </div>
    );
}

export default observer(SubNavbar);