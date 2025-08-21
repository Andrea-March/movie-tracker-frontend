import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFilm, faRightFromBracket, faSearch, faTrophy, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons'

import DarkModeToggle from './DarkModeToggle';
import MovieSearch from './MovieSearch';
import SubNavbar from './SubNavbar';
import ChallengeSubNavbar from './ChallengesSubNavbar';


const Navbar = () => {

  const navigate = useNavigate();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSerachBar, setShowSearchBar] = useState(false);
  const [showSubNavbar, setShowSubNavbar] = useState(window.location.pathname.includes("movies"));

  useEffect(()=>{setShowSubNavbar(window.location.pathname.includes("movies"))})
  
const hideMenu = () => {
  setShowMobileMenu(false);
}

const logout = () => {
  localStorage.removeItem("token");
  hideMenu();
  navigate("/login");
}


  return (
    <div className='navbar-container'>
      <nav className="navbar align-items-center">
        <div className='mobile-menu-icon-container'>
        <FontAwesomeIcon icon={faBars} size='xl' className='menu-icon' onClick={()=>{setShowMobileMenu(true)}}/>
        </div>
        {/* Logo a sinistra */}
        <div className="logo-container" onClick={()=>{setShowSearchBar(false);navigate('/movies/watched');}}>
          <div className="logo-img">
              <img src="/logo.png" alt="movie-tracker Logo" />
          </div>
          <h1 >MovieTracker</h1>
        </div>
        
        {/* Link centrali */}
        {/* <ul className="nav-links">
        <li onClick={()=>{navigate('/'); setShowMobileMenu(false);}}>
            Home
          </li>
          <li onClick={()=>{navigate('/watched'); }}>
            Visti
          </li>
          <li onClick={()=>{navigate('/to-watch');}}>
            Da Vedere
          </li>
          <FontAwesomeIcon icon={faRightFromBracket} size="2x" onClick={logout}/>
        </ul> */}
        <div className='icons-container'>
        <FontAwesomeIcon icon={faSearch} size={"xl"} className='search-icon' onClick={() => setShowSearchBar(!showSerachBar)}/>
                <div className={`movie-search-slider ${showSerachBar ? 'movie-search-slider-translate' : ''}`}>
                    <MovieSearch onCloseClick={()=>setShowSearchBar(false)}/>
                </div>
          <FontAwesomeIcon icon={faRightFromBracket} size="2x" onClick={logout} className='hide-on-mobile'/>
          <div className='hide-on-mobile'>
            <DarkModeToggle />
          </div>
          
        </div>
      </nav>

        {showSubNavbar && <SubNavbar />}

      <div className={`mobile-menu ${showMobileMenu ? 'mobile-menu-translate' : ''}`}>
        <div className='mobile-dark-toggle'>
          <DarkModeToggle/>
          <FontAwesomeIcon icon={faXmark} size="2x" onClick={()=>{setShowMobileMenu(false)}} className='mobile-menu-close-icon'/>
        </div>
          <ul className='mobile-nav-links flex-column align-items-center'>
            <li onClick={()=>{navigate('/movies/watched'); setShowSubNavbar(true);  hideMenu()}}>
              <FontAwesomeIcon icon={faFilm} size='lg' style={{marginRight: '20px'}}/>
              Home
            </li>
            <li onClick={() => { navigate('/challenges'); setShowSubNavbar(false); hideMenu() }} aria-label="Sfide mensili">
              <FontAwesomeIcon icon={faTrophy} size="lg" style={{marginRight: '20px'}}/>
              Sfide Mensili
            </li>
            <li onClick={() => { navigate('/groups'); setShowSubNavbar(false); hideMenu() }}>
              <FontAwesomeIcon icon={faUsers} size="lg" style={{marginRight: '20px'}}/>
              Gruppi
            </li>
            <li onClick={() => { setShowSubNavbar(false); hideMenu(); logout() }} >
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" style={{marginRight: '20px', color: "red"}}/>
              Logout
            </li>
          </ul>
     {/*      <div className='logout-mobile-container'>
            <FontAwesomeIcon icon={faRightFromBracket} size="2x" onClick={logout}/>
          </div>
           */}
      </div>
      
    </div>
  );
};

export default Navbar;