import React, {useContext, useState, useEffect}  from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import {Link } from "react-router-dom";

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
    Button
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
      flexDirection: 'row',
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

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    const [ shopcart, setShopcartData ] = useState(undefined);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ showForm, setForm ] = useState(false);
    const [candyData,setCandyData] = useState(undefined);
    const [quantChange,setQuantChange] = useState([]);
    const [itemDeleted,setItemDeleted] = useState(false);
    //const [totalPrice, setTotalPrice] = useState(0);
    const classes = useStyles();
    const intn = /^\+?[1-9][0-9]*$/
    let card
    //console.log(currentUser.email)
    useEffect(() =>{
        async function fetchData(){
            try{
                const data = await axios.get("http://localhost:4000/usershopcart/" + currentUser.email);
                const candy = await axios.get("http://localhost:4000/Candies");
                let newData = [];
                let changed = [];
                
                //console.log(data.data)
                for(let i = 0; i< data.data.length;i++){
                    let cand = candy.data.filter(ca=> data.data[i].id === ca._id)
                    
                    if(cand[0].stock ===0){
                        await axios.delete("http://localhost:4000/usershopcartid/" + currentUser.email,{ data: { id:cand[0]._id } })
                        
                        if(itemDeleted ===false) setItemDeleted(true)
                    }
                    else if(cand[0].stock < data.data[i].numbers){
                        data.data[i].numbers = cand[0].stock;
                        let body = {id: cand[0]._id, name : cand[0].name, price: cand[0].price, image:cand[0].image, numbers:data.data[i].numbers}
                        await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,)
                        
                        newData.push(data.data[i])
                        
                    }
                    else{
                        newData.push(data.data[i])
                    }
                }
                
                
                setQuantChange(changed);
                setShopcartData(newData)
                setCandyData(candy.data);
                //console.log(data.data)
                //useContext(data.data.results);
                setLoading(false)
                setError(false)
               
                //console.log(shopcart===undefined)

            }
            catch(e){
                setError(true)
                console.log(e)
            }
        }
        fetchData();

    }, [currentUser.email,itemDeleted]);
    const deleteC = async(id, candyNumber,name) =>{        
        try{
            await axios.delete("http://localhost:4000/usershopcartid/" + currentUser.email,{ data: { id:id } })
            .then(async res=>{
                let olddata = shopcart
               // console.log(shopcart)
                //let num 
                let changeData = olddata.filter((e, ind) => {
                    return e.id !== res.data.id;
                })
                //console.log(changeData)
                // olddata.splice(num,1)
                // console.log(shopcart)
                // console.log(olddata)
                alert("You have successfully deleted item: " +name + " from your cart" )
                setShopcartData(changeData)
            })
            
            
            
        }
        catch(e){
            alert(e)
        }
	}
    const changeCandy = async (id,name, price, image, number) => {
        let data1
      
        try{
            const {data} = await axios.get('http://localhost:4000/Candy/' + id);
            data1 = data
            console.log(data1)
        }
        catch(e){
            alert(e)
        }
        let numberha = document.getElementById(id).value
        let numberha1 = Number(numberha)
        //console.log(numberha1)
        //console.log(number)
        //console.log(data1.stock)

        if (isNaN(numberha1) || isNaN(numberha1) || isNaN(numberha1)){
          alert('input must be number')
          document.getElementById(id).value = ''
        }
        else if(intn.test(numberha) === false){
          alert('input must be integer')
          document.getElementById(id).value = ''
        }
        else if (numberha1  > data1.stock){
          alert('input must less than candy left')
          document.getElementById(id).value = ''
        }


        else{
            const body = {id: id, name : name, price: price, image:image, numbers:numberha1}
            
            
            if(numberha1 === number){
                alert(`You already have ${number} units in your cart, you can only edit to change the value`)
                return;
            }
            try{
                
                await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,)
                .then(res=>{
                    let olddata = shopcart
                    //let num 
                    //console.log(res)
                    let changeData = olddata.map((e, ind) => {
                        //if (e.id === res.id){
                        //num = ind
                        return e.id === res.data.id? res.data:e;
                        //}
                    })
                    // olddata.splice(num,1)
                    // olddata.push
                    // console.log(res)
                    //console.log(changeData)
                    setShopcartData(changeData)
                    //console.log(changeData)
                })
                
                alert('you have edited your shopping cart')
            }
            catch(e){
                alert(e)
            }
            
            document.getElementById(id).value = ''
        }
    };
    const clearShopCart = async (shopcart,totalprice) => {
        //Deletes the shopping cart

      let street= document.getElementById('street').value;
      let city= document.getElementById('city').value;
      let state= document.getElementById('state').value;
      let zip= document.getElementById('zip').value;
      let cardNum = document.getElementById('payment').value;
      let payment = cardNum.substring(cardNum.length -4);
      let address = street +', ' + city + ', ' + state + ', ' + zip;
      try{
      const checkStock = await axios.get("http://localhost:4000/Candies")
      let check;
      let stop = false;
      shopcart.forEach((e)=>{
        check = checkStock.data.filter(cand=> cand._id === e.id);

        if(check[0].stock < e.numbers){
            alert("There has been a change in stock, cannot complete order");
            stop = true;
            window.location.reload();
            return
        }
      })
        
      
        if(stop===false){
        await axios.post(`http://localhost:4000/order`, {
           email: currentUser.email,
           candy: shopcart,
           address: address,
           total: totalprice,
           payment: payment
        })

        //Deletes the shopping carty

        let updateInformation;
        let currentCandy;
        shopcart.forEach(async (e)=>{
            currentCandy = candyData.filter(cand=> cand._id === e.id) 
           // console.log(currentCandy)
            updateInformation  = {
                id: e.id,
                newStockNumber: (currentCandy[0].stock - e.numbers)

            }
            await axios.post('http://localhost:4000/Candies/updateStock', updateInformation)
        })
        
        await axios.delete(`http://localhost:4000/usershopcart/${currentUser.email}`)
        alert('thank you for your purchase')
       
        window.location.reload(false)
    }
    }catch(e){
        alert(e);
    }
    }
    const buildCards = (candy) =>{
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={candy.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardActionArea>
                        <Link to={`/Candy/${candy.id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image = {candy.image}
                                title = 'image'
                            />
                            <CardContent>
                                <Typography
                                className={classes.titleHead}
                                gutterBottom
                                variant='h6'
                                component='h3'
                                >
                                {candy.name}
                                </Typography>   
                            </CardContent>
                        </Link>
                        
                        
                        <h2>You have {candy.numbers} {candy.name} in your shopping cart </h2>
                        {quantChange.includes(candy.id)&&currentUser&&(
                            <h3>This quantity has changed!! </h3>
                            )}
                        <label>
                            <input
                                id={candy.id}
                                name='number'
                                placeholder='Change amount'
                            />
                        </label>
                        <Button onClick={()=>changeCandy(candy.id,candy.name, candy.price, candy.image, candy.numbers)}> Edit Quantity</Button>
                        <Button onClick={()=>deleteC(candy.id, candy.numbers,candy.name)}>Delete this candy</Button>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    } 

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
            //console.log('aaaa')
            return(
                
                <div>
                      {itemDeleted===true&&currentUser&&(
                        <h2 id='itemDeleted'>Due to changes in stock, one or more items have been removed from your cart. Please review your items before checking out</h2>
                    )}
                    <h2>Your didn't add any candy in to shopping cart go add some!!!</h2>
                </div>
            )
        }
        else{
            
            //console.log(shopcart)
            let totalprice = 0
            card  = shopcart && shopcart.map((eachCandy) =>{
                //console.log(eachCandy)
                totalprice = totalprice+ eachCandy.price * eachCandy.numbers
                return buildCards(eachCandy);
            })
            return (
                <div>

                    {quantChange.length!==0&&currentUser&&(
                        <h1 id='quantChange'>'Please review your cart, changes have been made due to changes in available stock</h1>
                    )}
                    {itemDeleted===true&&currentUser&&(
                        <h2 id='itemDeleted'>Due to changes in stock, one or more items have been removed from your cart. Please review your items before checking out</h2>
                    )}
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                    <h1>Total Price: {totalprice.toFixed(2)}</h1>
                    <button onClick={() => setForm(!showForm)}>Check out</button>
                    <form id='checkout' hidden={!showForm}>
                        <label>First Name
                        <input type="text" />
                        </label>
                        <br/>

                        <label>Last Name
                        <input type="text"/>
                        </label>
                        <br/>
                        
                        <h3>Address:</h3>
                        <label>Street Address
                        <input type="text" id='street'/>
                        </label>
                        <br/>
                        <label>City
                        <input type="text" id='city'/>
                        </label>
                        <br/>
                        <label> State
                        <input type="text" id= 'state'/>
                        </label>
                        <br/>
                        <label>Zipcode
                        <input type="text" id='zip'/>
                        </label>
                        <br/>


                        <label>Credit Card Number
                        <input type="text" id='payment'/>
                        </label>
                        <br/>
                    </form>

                <button onClick={() => clearShopCart(shopcart,totalprice)} hidden={!showForm}>Check Out</button>
            </div>
            );
        }
    }
    
}

export default ShoppingCart;