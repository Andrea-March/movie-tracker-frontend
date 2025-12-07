import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faListUl, faMagnifyingGlass, faPeopleGroup, faUser } from '@fortawesome/free-solid-svg-icons'
import DarkModeToggle from './DarkModeToggle';
import { movieStore } from '../stores/MovieStore';
import { useEffect } from 'react';


const Navbar = () => {

  const navigate = useNavigate();


  return (
    <div className='navbar-container'>
      <nav className="navbar align-items-center">
          <FontAwesomeIcon icon={faHome} size='xl' className='menu-icon' onClick={()=>{movieStore.closePopup();navigate('/');}}/>        
          <FontAwesomeIcon icon={faMagnifyingGlass} size='xl' className='menu-icon' onClick={()=>{movieStore.closePopup();navigate('/search');}}/>
          <FontAwesomeIcon icon={faPeopleGroup} size='xl' className='menu-icon' onClick={()=>{movieStore.closePopup();navigate('/groups');}}/>
          <FontAwesomeIcon icon={faListUl} size='xl' className='menu-icon' onClick={()=>{movieStore.closePopup();navigate('/movies');}}/>       
          <FontAwesomeIcon icon={faUser} size='xl' className='menu-icon' onClick={()=>{movieStore.closePopup();navigate('/user');}}/> 
          <DarkModeToggle/>
      </nav>      
    </div>
  );
};


export default Navbar;