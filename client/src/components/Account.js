import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import createPDF from './CreatePDF'
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';

function Account() {
  const {currentUser} = useContext(AuthContext);
  const [pastOrders, setPastOrders] = useState([])
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get('https://final554groupnull.herokuapp.com/order/' + currentUser.email);
        
        setPastOrders(data);
        //console.log(data)
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
    fetchData();
  }, [currentUser.email]);

  if (error){
    return (
      <div>
        <h2>404 page not find</h2>
      </div>
    )
  }
  if(loading){
    return(
      <div>
        <h2>Loading . . .</h2>
      </div>
    )
  } else{
   // console.log(pastOrders)
  return (
    <div>
      <h2>Account Page</h2>
      <ChangePassword />
      <SignOutButton />

      <br/>
      <h3>Past Orders</h3>
      {pastOrders&&currentUser&&(<ul id="reviewList">
            {pastOrders.map(e=>
              
              <li key={e._id}>
               <h4>Order #{e._id}</h4>
             
               
                <h5>Purchased Items:</h5>
                
                {e.order.candy.map(purchase=>
                <div key={purchase.name}>
                  <img src={purchase.image} alt='candy'/>
                  <p>Item: {purchase.name} </p>
                  <p>Price Per Unit: {purchase.price}</p>
                  <p>Quantity Purchased: {purchase.numbers}</p>
                  <p>Item total: {purchase.numbers * purchase.price}</p>
                </div>
                 )}
                
                <h5>Total Price {e.order.total}</h5>
                
                <h5>Payment Info: </h5>
                <p>Billing Address: {e.order.address} </p>
                <p>Payment Made With Card Ending In: {e.order.payment}</p>
                <button onClick={() => createPDF(e.order.candy)} >Generate Recipt</button>
              </li>
              
            )}

          </ul>)}
    </div>
    
  );
  }
}

export default Account;