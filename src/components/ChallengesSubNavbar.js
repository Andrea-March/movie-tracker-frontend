import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './SubNavbar.css'

const ChallengeSubNavbar = ({setComponent}) => {

    const navigate = useNavigate();

    const types = {
        JOINED_CHALLENGES: "joined",
        AVAILABLE_CHALLENGES: "available",
        BADGES: "badges"
    }

    const [activePage, setActivePage] = useState(types.JOINED_CHALLENGES);

    return (
          <div className="sub-navbar">
            <button
                className={activePage === types.JOINED_CHALLENGES ? "active" : ""}
                onClick={() => {setComponent(types.JOINED_CHALLENGES); setActivePage(types.JOINED_CHALLENGES)}}
            >
                Sfide Attive
            </button>
            <button
                className={activePage === types.AVAILABLE_CHALLENGES ? "active" : ""}
                onClick={() => {setComponent(types.AVAILABLE_CHALLENGES);setActivePage(types.AVAILABLE_CHALLENGES)}}
            >
                Nuove Sfide
            </button>
            <button
                className={activePage === types.BADGES ? "active" : ""}
                onClick={() => {setComponent(types.BADGES);setActivePage(types.BADGES)}}
            >
                Badges
            </button>
        </div>
    );
}

export default ChallengeSubNavbar