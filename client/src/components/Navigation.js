import React, { useContext } from 'react';
import {NavLink} from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import '../App.css';

const logo = 'https://see.fontimg.com/api/renderfont4/X3WjK/eyJyIjoiZnMiLCJoIjo2NSwidyI6MTI1MCwiZnMiOjUyLCJmZ2MiOiIjRkZGRUZFIiwiYmdjIjoiI0RCMzAzMCIsInQiOjF9/R3JvdXAgTnVsbA/uncracked-free-trial.png'

const Navigation = () => {
  const nameEl = React.useRef(null);
  const {currentUser} = useContext(AuthContext);

  //does someone know how to do this better as it forces a page refresh
  const handleSubmit = e => {
    e.preventDefault();
    window.location.href = '/candies/' + nameEl.current.value
  }

  
  const NavigationAuth = () => {
    return (
      <nav className='navigation'>
        <NavLink className='weblink' to='/'>
          <img src={logo} alt='logo failed to load'/>
        </NavLink>
        <div className='searchBar'>
          <NavLink className='weblink' to='/candies'>
            <input className='allButton' type="submit" value="All"/>
          </NavLink>
          <form className="searchForm" onSubmit={handleSubmit}>
            <input type ="search" size="50" placeholder="Search For Candies" ref={nameEl}/>
            <button type="submit"><i className="fa fa-search"></i></button>
          </form>
        </div>
        <NavLink className='weblink' to='/account'>
          <i className="fa fa-user-circle" aria-hidden="true">Account</i>
        </NavLink>
        <NavLink className='weblink' to='/shoppingcart'> 
          <i className="fa fa-shopping-cart" aria-hidden="true">My Cart</i>
        </NavLink>
      </nav>
    );
  };
  
  const NavigationNonAuth = () => {
    return (
      <nav className='navigation'>
        <NavLink className='weblink' to='/'>
          <img src={logo} alt='logo failed to load'/>
        </NavLink>
        <div className='searchBar'>
          <NavLink className='weblink' to='/candies'>
            <input className='allButton' type="submit" value="All"/>
          </NavLink>
          <form className="searchForm" onSubmit={handleSubmit}>
            <input type ="search" size="50" placeholder="Search For Candies" ref={nameEl}/>
            <button type="submit"><i className="fa fa-search"></i></button>
          </form>
        </div>
        <NavLink className='weblink' to='/signup'> 
          Sign-up
        </NavLink>
        <NavLink className='weblink' to='/signin'> 
          Sign-In
        </NavLink>
      </nav>
    );
  };

  return currentUser ? <NavigationAuth /> : <NavigationNonAuth />;
};
  
  export default Navigation;