import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import createPDF from './CreatePDF'
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import { Link } from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles
} from '@material-ui/core';

import '../App.css';

const useStyles = makeStyles({
  card: {
    maxWidth: 350,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

function Account() {
  const {currentUser} = useContext(AuthContext);
  const [pastOrders, setPastOrders] = useState([])
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  const classes = useStyles();



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

  const buildCards = (candy) =>{
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={candy._id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link to={`/Candy/${candy._id}`}>
                <CardMedia
                  className={classes.media}
                  component='img'
                  image = {candy.image}
                  title = 'image'
                />
                <CardContent>
                  <h2>Item: {candy.name}</h2>
                  <h2>Price Per Unit: ${candy.price.toFixed(2)}</h2>
                  <h2>Quantity Purchased: {candy.purchase}</h2>
                  <h2>Item Total: ${(candy.numbers * candy.price).toFixed(2)}</h2>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
      </Grid>
    );
  }

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
                      <div className="OrderItem">
                        <img src={purchase.image} alt='candy'/>
                        <div className="OrderInfo">
                          <div className="TopOrderInfo">
                            <p>{purchase.name} </p>
                            <p><b>${(purchase.numbers * purchase.price).toFixed(2)}</b></p>
                          </div>
                          <p>${purchase.price.toFixed(2)} ea</p>
                          <div className="BottomOrderInfo">
                            <p>Quantity Purchased: {purchase.numbers}</p>
                            <button>Order Again</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='TotalOrderInfo'>
                    <p><b>Total Price {parseFloat(e.order.total).toFixed(2)}</b></p>
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