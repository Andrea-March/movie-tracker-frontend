import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './SubNavbar.css'

const SubNavbar = () => {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState(window.location.pathname);

    return (
          <div className="sub-navbar">
            <button
                style={{minWidth: "91px"}}
                className={activePage === "/movies/explore" ? "active" : ""}
                onClick={() => {navigate("/movies/explore"); setActivePage("/movies/explore")}}
            >
                Esplora
            </button>
            <button
                className={activePage === "/movies/watched" || activePage === "/" ? "active" : ""}
                onClick={() => {navigate("/movies/watched"); setActivePage("/movies/watched")}}
            >
                Film Visti
            </button>
            <button
                className={activePage === "/movies/to-watch" ? "active" : ""}
                onClick={() => {navigate("/movies/to-watch"); setActivePage("/movies/to-watch")}}
            >
                Da Vedere
            </button>
        </div>
    );
}

export default SubNavbar