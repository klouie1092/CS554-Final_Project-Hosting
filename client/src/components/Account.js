import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import createPDF from './CreatePDF'
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import { Link } from 'react-router-dom';

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

  const changeCandy = async (id , name, price,image,number) => {
    let numberha1 = Number(number)
    const body = {id:id, name :name, price:price, image:image, numbers:number}
      
    try{
      await axios.put('https://final554groupnull.herokuapp.com/usershopcart/'+ currentUser.email, body,)
      .then(res=>{})
      alert(`You successfully added ${numberha1} units to your cart`)
    }
    catch(e){
      alert(e)
    }
  };


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
        <h1>Account Page</h1>
        <ChangePassword />
        <SignOutButton />
        <br/>
        <h3>Past Orders</h3>
        {pastOrders&&currentUser&&(<ul id="reviewList">
          {pastOrders.map(e=>
            
            <li key={e._id}>
              <h4>Order #{e._id}</h4>
          
              <h5>Purchased Items:</h5>
              <div className='PastPurchase'>
                <div className='ItemList'>
                  {e.order.candy.map(purchase=>
                    <div key={purchase.id} className="OrderItem">
                      <Link to={`/Candy/${purchase.id}`}>
                        <img className ='orderImage' src={purchase.image} alt='candy'/>
                      </Link>
                      <div className="OrderInfo">
                        <div className="TopOrderInfo">
                          <p>{purchase.name} </p>
                          <p><b>${(purchase.numbers * purchase.price).toFixed(2)}</b></p>
                        </div>
                        <p>${purchase.price.toFixed(2)} ea</p>
                        <div className="BottomOrderInfo">
                          <p>Quantity Purchased: {purchase.numbers}</p>
                          <button onClick={() => changeCandy(purchase.id,purchase.name,purchase.price,purchase.image,purchase.numbers)}>Order Again</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className='TotalOrderInfo'>
                  <p><b>Total Price: ${parseFloat(e.order.total).toFixed(2)}</b></p>
                  <p><b>Payment Info: </b></p>
                  <p>Billing Address: {e.order.address} </p>
                  <p>Payment Made With Card Ending In: {e.order.payment}</p>
                  <button onClick={() => createPDF(e.order.candy)} >Generate Recipt</button>
                </div>
              </div>
            </li>             
          )}
        </ul>)}
      </div>
    );
  }
}

export default Account;