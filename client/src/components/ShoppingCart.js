import React, {useContext, useState, useEffect}  from 'react';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import axios from 'axios';
import {useParams, Link } from "react-router-dom";
import '../App.css';

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    const [ shopcart, setShopcartData ] = useState(undefined);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    console.log(currentUser.email)
    useEffect(() =>{
        async function fetchData(){
            try{
                const data = await axios.get("http://localhost:4000/usershopcart/" + currentUser.email);
                console.log(data.data)
                //useContext(data.data.results);
                setLoading(false)
                setError(false)
                setShopcartData(data.data);
                console.log(shopcart===undefined)

            }
            catch(e){
                setError(true)
                console.log(e)
            }
        }
        fetchData();

    }, []);
    if (error === true){
        return (
            <div>
                <h2>404 page not find</h2>
            </div>
        )
    }
    else if(loading === true){
        return(
            <div>
                <h2>Loading . . .</h2>
            </div>
        )
    }
    else{
        //console.log(shopcart)
        if(shopcart === undefined || shopcart.length === 0){
            console.log('aaaa')
            return(
                <div>
                    <h2>Your didn't add any candy in to shopping cart go add some!!!</h2>
                </div>
            )
        }
        else{
            return (
                <div>
                    <h2>This is the Shopping Cart page</h2>
                </div>
            );
        }
    }
    
}

export default ShoppingCart;