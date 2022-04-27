import React, {useContext}  from 'react';
import { AuthContext } from '../firebase/Auth';

import '../App.css';

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser.email)
    return (
        <div>
            <h2>This is the Shopping Cart page</h2>
        </div>
    );
}

export default ShoppingCart;