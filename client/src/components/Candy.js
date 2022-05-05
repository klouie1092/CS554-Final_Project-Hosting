import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";
import { AuthContext } from '../firebase/Auth';

const Candy = () =>{
  const {currentUser} = useContext(AuthContext);
  const [candyInfo, setCandyInfo] = useState(undefined)
  const [candyHave, setCandyHave] = useState(0)
  const params = useParams();
  const intn = /^\+?[1-9][0-9]*$/


  useEffect(() => {
    async function fetchData() {
      try {
        let candyId = params.id
        const {data} = await axios.get('http://localhost:4000/Candy/' + candyId);
        setCandyInfo(data);

        if(currentUser !== null){
          const have = await axios.get('http://localhost:4000/usershopcart/' + currentUser.email)
          let changeData = await have.data.filter((e) => {
            if (e.id === candyId){
              return [0]
            }
          })
          //console.log(changeData[0].numbers)
          if(changeData[0].numbers){
            //console.log('aaa')
            setCandyHave(changeData[0].numbers)
            //console.log(candyHave)
          }
          console.log(candyHave)
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const changeCandy = async () => {
    let numberha = document.getElementById('number').value
    let numberha1 = Number(numberha)
    if (isNaN(numberha1) || isNaN(numberha1) || isNaN(numberha1)){
      alert('input must be number')
      document.getElementById('number').value = ''
    }
    else if(intn.test(numberha) === false){
      alert('input must be integer')
      document.getElementById('number').value = ''
    }
    else if (numberha1 > candyInfo.stock){
      alert('input must less than candy left')
      document.getElementById('number').value = ''
    }
    else{
      let total = numberha1 + candyHave
      const body = {id: params.id, name : candyInfo.name, price: candyInfo.price, image:candyInfo.image, numbers:total}
      try{
        const setdata = await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,).then(res=>{console.log(res)})
        alert('you add it to shopping cart')
      }
      catch(e){
        alert(e)
      }
      document.getElementById('number').value = ''
    } 
  };

  const roundToHalf = (num) =>{
    return Math.round(num * 2) / 2;
  }

  const makeStarRating = (rating) => {
    rating = roundToHalf(rating);
    let content = [];
    for (let i = 0; i < 5; i++) {
      if (rating - i === .5) {
        content.push(<i class="fa fa-star-half-full checked"/>);
      } else if (rating - i > 0) {
        content.push(<i class="fa fa-star checked"/>);
      } else {
        content.push(<i class="fa fa-star-o checked"/>);
      }
    }
    return content;
  }


  if(candyInfo === undefined){
    return(
      <div>
        <h1>Sorry, there is no such candy</h1>
      </div>
    )
  }

  return(
    <div className='Candy-body'>
      <img src = {candyInfo.image} width= {400} height = {400} alt = "Candy image" />
      <h1>{candyInfo&&candyInfo.name}</h1>
      <h2>{makeStarRating(candyInfo.rating)}</h2>
      <br />
      <h2>Price: ${candyInfo&&candyInfo.price.toFixed(2)}</h2>
      <br />
      <h3>There is {candyInfo&&candyInfo.stock} left</h3>
      <br />
      <h4>{candyInfo&&candyInfo.manufacturer}</h4>
      <h5>{candyInfo&&candyInfo.descrption}</h5>
      <div className='add'>
      {currentUser&&(<div className='input-selection'>
        <label>
          you have {candyHave} Candies:
          <input
            id='number'
            name='number'
            placeholder='number that you want to add'
          />
        </label>
      </div>)}
      {currentUser&&(<button onClick={changeCandy}> add to card</button>)}
      {!currentUser&&(<h6> login for add candy to shopping cart</h6>)}
    </div>

    </div>
  )
};

export default Candy