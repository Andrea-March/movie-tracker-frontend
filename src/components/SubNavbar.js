import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import './SubNavbar.css'

const SubNavbar = () => {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState(window.location.pathname);

    useEffect(()=>{console.log(window.location.pathname)})

    return (
          <div className="sub-navbar">
            <button
                className={activePage === "/explore" ? "active" : ""}
                onClick={() => {navigate("explore"); setActivePage("/explore")}}
            >
                Esplora
            </button>
            <button
                className={activePage === "/watched" || activePage === "/" ? "active" : ""}
                onClick={() => {navigate("watched"); setActivePage("/watched")}}
            >
                Film Visti
            </button>
            <button
                className={activePage === "/to-watch" ? "active" : ""}
                onClick={() => {navigate("to-watch"); setActivePage("/to-watch")}}
            >
                Da Vedere
            </button>
        </div>
    );
}

export default SubNavbar