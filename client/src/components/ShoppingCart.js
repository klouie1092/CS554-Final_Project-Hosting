import React, {useContext, useState, useEffect}  from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import {useParams, Link } from "react-router-dom";
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

function ShoppingCart() {
    const {currentUser} = useContext(AuthContext);
    const [ shopcart, setShopcartData ] = useState(undefined);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    //const [totalPrice, setTotalPrice] = useState(0);
    const classes = useStyles();
    const intn = /^\+?[1-9][0-9]*$/
    let card
    //console.log(currentUser.email)
    useEffect(() =>{
        async function fetchData(){
            try{
                const data = await axios.get("http://localhost:4000/usershopcart/" + currentUser.email);
                //console.log(data.data)
                //useContext(data.data.results);
                setLoading(false)
                setError(false)
                setShopcartData(data.data);
                //console.log(shopcart===undefined)

            }
            catch(e){
                setError(true)
                console.log(e)
            }
        }
        fetchData();

    }, []);
    const deleteC = async(id) =>{
        try{
            //console.log(id)
            const dele = await axios.delete("http://localhost:4000/usershopcartid/" + currentUser.email,{ data: { id:id } })
            .then(res=>{
                let olddata = shopcart
                console.log(shopcart)
                //let num 
                let changeData = olddata.filter((e, ind) => {
                    return e.id != res.data.id;
                })
                console.log(changeData)
                // olddata.splice(num,1)
                // console.log(shopcart)
                // console.log(olddata)
                setShopcartData(changeData)
            })
            alert("successful delete the candy")
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
        if (isNaN(numberha1) || isNaN(numberha1) || isNaN(numberha1)){
          alert('input must be number')
          document.getElementById(id).value = ''
        }
        else if(intn.test(numberha) === false){
          alert('input must be integer')
          document.getElementById(id).value = ''
        }
        else if (numberha1 > data1.stock){
          alert('input must less than candy left')
          document.getElementById(id).value = ''
        }
        else{
          const body = {id: id, name : name, price: price, image:image, numbers:numberha1}
          try{
            const setdata = await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,)
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
            alert('you Edit it to shopping cart')
          }
          catch(e){
            alert(e)
          }
          
          document.getElementById(id).value = ''
        }
        
    };
    const buildCards = (candy) =>{
        return(
            <Grid item xs={12} sm={12} md={4} lg={3} xl={12} key={candy.id}>
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
                    </CardActionArea>
                    <h2>You have {candy.numbers} {candy.name} in your shopping cart</h2>
                    <label>
                        <input
                            id={candy.id}
                            name='number'
                            placeholder='number that you want to add'
                        />
                    </label>
                    <Button onClick={()=>changeCandy(candy.id,candy.name, candy.price, candy.image, candy.numbers)}> Edit Candy</Button>
                    <Button onClick={()=>deleteC(candy.id)}>Delete this candy</Button>
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
                    {card}
                    <h1>Total Price: {totalprice}</h1>
                    <button>Check out</button>
                </div>
            );
        }
    }
    
}

export default ShoppingCart;