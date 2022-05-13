import React, {useContext, useState, useEffect}  from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import {Link} from "react-router-dom";

import {
    Button
  } from '@material-ui/core';

import '../App.css';

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    const [ shopcart, setShopcartData ] = useState(undefined);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ showForm, setForm ] = useState(false);
    const [ candyData,setCandyData] = useState(undefined);
    const [ quantChange,setQuantChange] = useState([]);
    const [ itemDeleted,setItemDeleted] = useState(false);
    const [ firstName, setFirstName] = useState('');
    const [ lastName, setLastName] = useState('');
    const [ street, setStreet] = useState('');
    const [ city, setCity] = useState('');
    const [ state, setState] = useState('');
    const [ zip, setZip] = useState(0);
    const [ payment, setPayment] = useState(0);
    //const [totalPrice, setTotalPrice] = useState(0);
    const intn = /^\+?[1-9][0-9]*$/
    //console.log(currentUser.email)
    useEffect(() =>{
        async function fetchData(){
            try{
                const data = await axios.get("https://final554groupnull.herokuapp.com/usershopcart/" + currentUser.email);
                const candy = await axios.get("https://final554groupnull.herokuapp.com/Candies");
                let newData = [];
                let changed = [];
                
                //console.log(data.data)
                let boolCheck = false;
                for(let i = 0; i< data.data.length;i++){
                    let cand = candy.data.filter(ca=> data.data[i].id === ca._id)
                    
                    if(cand[0].stock ===0){
                        await axios.delete("https://final554groupnull.herokuapp.com/usershopcartid/" + currentUser.email,{ data: { id:cand[0]._id } })
                        
                        if(boolCheck ===false) boolCheck = true
                    }
                    else if(cand[0].stock < data.data[i].numbers){
                        data.data[i].numbers = cand[0].stock;
                        let body = {id: cand[0]._id, name : cand[0].name, price: cand[0].price, image:cand[0].image, numbers:data.data[i].numbers}
                        await axios.put('https://final554groupnull.herokuapp.com/usershopcart/'+ currentUser.email, body,)
                        changed.push(data.data[i])
                        newData.push(data.data[i])
                        
                    }
                    else{
                        newData.push(data.data[i])
                    }
                }
                
                setItemDeleted(boolCheck);
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

    }, [currentUser.email]);

    const deleteC = async(id, candyNumber,name) =>{        
        try{
            await axios.delete("https://final554groupnull.herokuapp.com/usershopcartid/" + currentUser.email,{ data: { id:id } })
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
            const {data} = await axios.get('https://final554groupnull.herokuapp.com/Candy/' + id);
            data1 = data
            //console.log(data1)
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
          alert('There is not enough stock available to add that amount to your cart')
          document.getElementById(id).value = ''
        }


        else{
            const body = {id: id, name : name, price: price, image:image, numbers:numberha1}
            
            
            if(numberha1 === number){
                alert(`You already have ${number} units in your cart, you can only edit to change the value`)
                return;
            }
            try{
                
                await axios.put('https://final554groupnull.herokuapp.com/usershopcart/'+ currentUser.email, body,)
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
    const dataCheck = async (e) => {
        e.preventDefault()
        let totalprice = shopcart.reduce((curr, item) => curr + item.price * item.numbers, 0)

        if(typeof firstName !== 'string' || firstName === ''){
            alert('please enter a valid firstName')
            return;
        }
        if(typeof lastName !== 'string' || lastName === ''){
            alert('please enter a valid lastName')
            return;
        }
        if(typeof street !== 'string' || street === ''){
            alert('please enter a valid street')
            return;
        }
        if(typeof city !== 'string' || city === ''){
            alert('please enter a valid city')
            return;
        }
        if(typeof state !== 'string' || state === ''){
            alert('please enter a valid state')
            return;
        }
        if(typeof zip !== 'string' || isNaN(parseInt(zip)) ||  zip.length !== 5){
            alert('please enter a valid zipcode')
            return
        }
        if(typeof payment !== 'string' || isNaN(parseInt(payment)) || payment.length > 19 || payment.length < 8){
            alert('please enter a valid credit card number')
            return
        }

        clearShopCart(shopcart, totalprice)

    }
    const clearShopCart = async (shopcart,totalprice) => {
        //Deletes the shopping cart
        let paymentInfo = payment.substring(payment.length -4);
        let address = street +', ' + city + ', ' + state + ', ' + zip;
        try{
        const checkStock = await axios.get("https://final554groupnull.herokuapp.com/Candies")
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
            await axios.post(`https://final554groupnull.herokuapp.com/order`, {
            email: currentUser.email,
            candy: shopcart,
            address: address,
            total: totalprice,
            payment: paymentInfo
            })

            //Deletes the shopping cart

            let updateInformation;
            let currentCandy;
            shopcart.forEach(async (e)=>{
                currentCandy = candyData.filter(cand=> cand._id === e.id) 
            // console.log(currentCandy)
                updateInformation  = {
                    id: e.id,
                    newStockNumber: (currentCandy[0].stock - e.numbers)

                }
                await axios.post('https://final554groupnull.herokuapp.com/Candies/updateStock', updateInformation)
            })
            
            await axios.delete(`https://final554groupnull.herokuapp.com/usershopcart/${currentUser.email}`)
            alert('thank you for your purchase')
        
            window.location.reload(false)
        }
        }catch(e){
            alert(e);
        }
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
        if(shopcart === undefined || shopcart.length === 0){
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
            const items = shopcart && shopcart.reduce((partialSum, a) => partialSum + a.numbers, 0);
            const totalprice = shopcart && shopcart.reduce((partialSum, a) => partialSum + a.price * a.numbers, 0);
            return (
                <div className='FullPage'>
                  {quantChange.length!==0&&currentUser&&(
                    <div id='quantChange'>'Please review your cart, changes have been made due to changes in available stock</div>
                  )}
                  {itemDeleted===true&&currentUser&&(
                    <div id='itemDeleted'>Due to changes in stock, one or more items have been removed from your cart. Please review your items before checking out</div>
                  )}
                  <div className='ShoppingCart'>
                    <div className='TopCheckout'>
                      <h1>Cart</h1>
                      <span>({items} items)</span>
                    </div>
                    <div className='PastPurchase'>
                      <div className='ItemList'>
                        {shopcart && shopcart.map((candy) =>
                        <div key={candy.id} className="OrderItem">
                          <Link to={`/Candy/${candy.id}`}>
                            <img className ='orderImage' src={candy.image} alt='candy'/>
                          </Link>
                          <div className="OrderInfo">
                            <div className="TopOrderInfo">
                              <p>{candy.name} </p>
                              <p><b>${(candy.numbers * candy.price).toFixed(2)}</b></p>
                            </div>
                            <p>${candy.price.toFixed(2)} ea</p>
                            <div className="BottomOrderInfo">
                              <p>Quantity Purchased: {candy.numbers}</p>
                              <label>
                                <input
                                  id={candy.id}
                                  name='number'
                                  placeholder='Change amount'
                                />
                              </label>
                              <Button onClick={()=>changeCandy(candy.id,candy.name, candy.price, candy.image, candy.numbers)}> Edit Quantity</Button>
                              <Button onClick={()=>deleteC(candy.id, candy.numbers,candy.name)}>Remove</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='Checkout'>
                      <h1>Total Price: {totalprice.toFixed(2)}</h1>
                      <button onClick={() => setForm(!showForm)}>Check out</button>
                      <form id='checkout' hidden={!showForm} onSubmit={dataCheck}>
                          <label>First Name
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                          </label>
                          <br/>
                          <label>Last Name
                          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
                          </label>
                          <br/>
                          <h2>Address:</h2>
                          <label>Street Address
                          <input type="text" id='street' value={street} onChange={e => setStreet(e.target.value)}/>
                          </label>
                          <br/>
                          <label>City
                          <input type="text" id='city' value={city} onChange={e => setCity(e.target.value)}/>
                          </label>
                          <br/>
                          <label> State
                          <input type="text" id= 'state' value={state} onChange={e => setState(e.target.value)}/>
                          </label>
                          <br/>
                          <label>Zipcode
                          <input type="number" id='zip' value={zip} onChange={e => setZip(e.target.value)}/>
                          </label>
                          <br/>
                          <label>Credit Card Number
                          <input type="number" id='payment' value={payment} onChange={e => setPayment(e.target.value)}/>
                          </label>
                          <br/>
                          <input type="submit" value="Submit"/>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
        }
    }
    
}

export default ShoppingCart;