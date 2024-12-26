import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'

import DarkModeToggle from './DarkModeToggle';
import MovieSearch from './MovieSearch';


const Navbar = () => {

  const navigate = useNavigate();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSerachBar, setShowSearchBar] = useState(false);
  
const hideMenu = () => {
  setShowMobileMenu(false);
}


  return (
    <div className='navbar-container'>
      <nav className="navbar align-items-center">
        <div className='mobile-menu-icon-container'>
        <FontAwesomeIcon icon={faBars} size='2x' className='menu-icon' onClick={()=>{setShowMobileMenu(true)}}/>
        </div>
        {/* Logo a sinistra */}
        <div className="logo-container" onClick={()=>{setShowSearchBar(false);navigate('/');}}>
          <div className="logo-img">
              <img src="/logo.png" alt="movie-tracker Logo" />
          </div>
          <h1 >MovieTracker</h1>
        </div>
        <FontAwesomeIcon icon={faSearch} size={"2x"} className='search-icon' onClick={() => setShowSearchBar(!showSerachBar)}/>
                <div className={`movie-search-slider ${showSerachBar ? 'movie-search-slider-translate' : ''}`}>
                    <MovieSearch onCloseClick={()=>setShowSearchBar(false)}/>
                </div>
        {/* Link centrali */}
        <ul className="nav-links">
        <li onClick={()=>{navigate('/'); setShowMobileMenu(false);}}>
            Home
          </li>
          <li onClick={()=>{navigate('/watched'); }}>
            Visti
          </li>
          <li onClick={()=>{navigate('/to-watch');}}>
            Da Vedere
          </li>
        </ul>
        <div className='desktop-dark-toggle'>
          <DarkModeToggle/>
        </div>
        

        
      </nav>
      <div className={`mobile-menu ${showMobileMenu ? 'mobile-menu-translate' : ''}`}>
      <div className='mobile-dark-toggle'>
        <DarkModeToggle/>
        <FontAwesomeIcon icon={faXmark} size="2x" onClick={()=>{setShowMobileMenu(false)}} className='mobile-menu-close-icon'/>
      </div>
          <ul className='mobile-nav-links flex-column'>
          <li onClick={()=>{navigate('/'); hideMenu()}}>
            Home
          </li>
          <li onClick={()=>{navigate('/watched');hideMenu()}}>
            Visti
          </li>
          <li onClick={()=>{navigate('/to-watch'); hideMenu()}}>
            Da Vedere
          </li>
          </ul>
          
      </div>
      
    </div>
  );
};

export default Navbar;