import React, {useContext, useState, useEffect}  from 'react';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import axios from 'axios';
import {useParams, Link } from "react-router-dom";
import '../App.css';

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    const [ shopcart, setShopcartData ] = useState(undefined);
    console.log(currentUser.email)
    useEffect(() =>{
        async function fetchData(){
            try{
                const data = await axios.get("http://localhost:4000/usershopcart/" + currentUser.email);
                console.log(data.data)
                //useContext(data.data.results);
                setShopcartData(data.data);
                //console.log(count)

            }
            catch(e){
                console.log(e)
            }
        }
        fetchData();

    }, []);
    return (
        <div>
            <h2>This is the Shopping Cart page</h2>
        </div>
    );
}

export default ShoppingCart;