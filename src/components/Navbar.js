import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import DarkModeToggle from './DarkModeToggle';


const Navbar = () => {

  const navigate = useNavigate();

/*   const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  } */


  return (
    <div className='navbar-container'>
      <nav className="navbar align-items-center">
          <FontAwesomeIcon icon={faHome} size='xl' className='menu-icon' onClick={()=>{navigate('/movies');}}/>        
          <FontAwesomeIcon icon={faUser} size='xl' className='menu-icon' onClick={()=>{navigate('/user');}}/>
          <DarkModeToggle/>
      </nav>      
    </div>
  );
};

export default Navbar;