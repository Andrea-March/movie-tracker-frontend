import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import DarkModeToggle from './DarkModeToggle';
import { movieStore } from '../stores/MovieStore';


const Navbar = () => {

  const navigate = useNavigate();

  /* const [showMobileMenu, setShowMobileMenu] = useState(false); */

/*   
  const hideMenu = () => {
    setShowMobileMenu(false);
  }
 */
  const logout = () => {
    localStorage.removeItem("token");
    /* hideMenu(); */
    navigate("/login");
  }


  return (
    <div className='navbar-container'>
      <nav className="navbar align-items-center">
          <FontAwesomeIcon icon={faHome} size='xl' className='menu-icon' onClick={()=>{navigate('/movies');}}/>        
          <FontAwesomeIcon icon={faUser} size='xl' className='menu-icon' onClick={()=>{navigate('/user');}}/>
          <DarkModeToggle/>
      </nav>

      {/* <div className={`mobile-menu ${showMobileMenu ? 'mobile-menu-translate' : ''}`}>
        <div className='mobile-dark-toggle'>
          
          <FontAwesomeIcon icon={faXmark} size="2x" onClick={()=>{setShowMobileMenu(false)}} className='mobile-menu-close-icon'/>
        </div>
          <ul className='mobile-nav-links flex-column align-items-center'>
            <li onClick={()=>{navigate('/movies/watched'); hideMenu()}}>
              <FontAwesomeIcon icon={faFilm} size='lg' style={{marginRight: '20px'}}/>
              Home
            </li>
            {/* <li onClick={() => { navigate('/challenges'); setShowSubNavbar(false); hideMenu() }} aria-label="Sfide mensili">
              <FontAwesomeIcon icon={faTrophy} size="lg" style={{marginRight: '20px'}}/>
              Sfide Mensili
            </li>
            <li onClick={() => { navigate('/groups'); setShowSubNavbar(false); hideMenu() }}>
              <FontAwesomeIcon icon={faUsers} size="lg" style={{marginRight: '20px'}}/>
              Gruppi
            </li> 
            <li onClick={() => { navigate('/groups'); hideMenu() }}>
              <FontAwesomeIcon icon={faUsers} size="lg" style={{marginRight: '20px'}}/>
              MoodAdvisor
            </li>
            <li onClick={() => {hideMenu(); logout() }} >
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" style={{marginRight: '20px', color: "red"}}/>
              Logout
            </li>
          </ul>
                <div className='logout-mobile-container'>
                  <FontAwesomeIcon icon={faRightFromBracket} size="2x" onClick={logout}/>
                </div>

      </div> */}
      
    </div>
  );
};

export default Navbar;