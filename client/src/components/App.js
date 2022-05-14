import React from 'react'
import '../App.css';
import Account from './Account';
import {HashRouter as Router,Route, Routes} from 'react-router-dom'
import Home from './Home';
import Landing from './Landing'
import Navigation from './Navigation';
import SignIn from './SignIn'
import SignUp from './SignUp'
import ShoppingCart from './ShoppingCart';
import CandyList from './CandyList'
import Candy from './Candy';

import {AuthProvider} from "../firebase/Auth"
import PrivateRoute from './PrivateRoute';
function App() {
  return (
    <AuthProvider>
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Navigation />
        </header>
      </div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/CS554-Final_Project-Hosting' element={<Landing />} />
        <Route path='/home' element={<PrivateRoute />}>
          <Route path='/home' element={<Home />} />
        </Route>
        <Route path='/shoppingcart' element={<ShoppingCart />}></Route>
        <Route path='/account' element={<PrivateRoute />}>
        <Route path='/account' element={<Account />} />
        </Route>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path= '/Candies' element={<CandyList/>} />
        <Route path= '/Candies/:searchTerm' element={<CandyList/>} />
        <Route path= '/Candy/:id' element={<Candy/>} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
