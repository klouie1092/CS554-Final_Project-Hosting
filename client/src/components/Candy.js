import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";
import { AuthContext } from '../firebase/Auth';
import '../Candy.css';

const Candy = () =>{
  const {currentUser} = useContext(AuthContext);
  const [candyInfo, setCandyInfo] = useState(undefined)
  const [candyHave, setCandyHave] = useState(0)
  const [candyStock, setCnadyStock] = useState(0)
  const params = useParams();
  const intn = /^\+?[1-9][0-9]*$/;

  const veganCheck = 'https://iamgoingvegan.b-cdn.net/wp-content/uploads/2020/05/European-Vegetarian-Symbol-961x1024.png'


  useEffect(() => {
    async function fetchData() {
      try {
        let candyId = params.id
        const {data} = await axios.get('http://localhost:4000/Candy/' + candyId);
        setCandyInfo(data);
        setCnadyStock(data.stock)

        if(currentUser !== null){
          const have = await axios.get('http://localhost:4000/usershopcart/' + currentUser.email)
          let changeData = await have.data.filter((e) => {
            return e.id === candyId
          })
          //console.log(changeData)
          if(changeData.length !== 0 && changeData[0].numbers){
            setCandyHave(changeData[0].numbers)
          }

          
          console.log(candyHave)
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [candyHave, currentUser, params.id]);

  const reviewCandy = async () =>{
    let rating = document.getElementById('rating').value;
    let review = document.getElementById('review').value;
    if(!review){
      review = " ";
    }
    if(review.trim(' ').length === 0) review = " ";
    let email = currentUser.email;
    //let candyId = candyInfo._id;
    
    try{
      /*
      let newReview = await axios.post('http://localhost:4000/review',{
        candyId: candyId,
        email: email,
        review: review,
        rating: rating
      });
      */
      let reviewDiv =document.getElementById('newReview');
      reviewDiv.style.display = "none";
      if(review.trim(' ').length!==0){
      document.getElementById('rating').value='';
      document.getElementById('review').value='';
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); 
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;
      
      let li = document.createElement("user-review");
      let entry1 = document.createElement("p")
      let text1 = document.createTextNode("Review by " + email + "  on " + today)
      let entry2 = document.createElement("p")
      let text2 = document.createTextNode("Rating " + rating)
      let entry3 = document.createElement("p")
      let text3 = document.createTextNode("Review: " + review)
      entry1.appendChild(text1)
      entry2.appendChild(text2)
      entry3.appendChild(text3)
      li.appendChild(entry1)
      li.appendChild(entry2)
      li.appendChild(entry3)
      let ul= document.getElementById('reviewList')
      ul.appendChild(li)
      }
    }catch(e){
      alert(e);
    }
  }
  const changeCandy = async () => {
    let numberha = document.getElementById('number').value
    let numberha1 = Number(numberha)
    let newStock = candyStock - numberha1
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
      const updateInfomation = {id:params.id, newStockNumber: newStock}
      try{
        await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,)
        .then(res=>{
          setCandyHave(res.data.numbers)
          setCnadyStock(newStock)
          console.log(newStock)
          console.log(res)
        })
        alert(`You successfully purchased ${numberha1} units`)
        await axios.post('http://localhost:4000/Candies/updateStock', updateInfomation).then(res=>{})
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
        content.push(<i className="fa fa-star-half-full checked" key={`star${i}`}/>);
      } else if (rating - i > 0) {
        content.push(<i className="fa fa-star checked" key={`star${i}`}/>);
      } else {
        content.push(<i className="fa fa-star-o checked" key={`star${i}`}/>);
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
  let notBlank = [];
  let reviewed = false;
  candyInfo.reviews.forEach((e)=>{
    if(currentUser){
    if(e.email === currentUser.email){
      reviewed =  true;
    }
  }
    if(e.review.trim(' ').length!==0) notBlank.push(e);
  
  })
 
  if(reviewed){
    return(
      <div className='Candy-body'>
        <div className='Top-Info'>
          <img src = {candyInfo.image} alt = "Candy" />
          <div className='Right-Top'>
            <div className='Top-Top-Info'>
              <p><u>{candyInfo&&candyInfo.manufacturer}</u></p>
              {candyInfo.vegan&&<img src = {veganCheck} width={40} height={40} alt='veganCheck'/>}
            </div>
            <h1>{candyInfo&&candyInfo.name}</h1>
            <div className='Review-Info'>
              <h2>{makeStarRating(candyInfo.rating)}</h2>
              <p>({candyInfo.rating.toFixed(1)})</p>
              <a className='numReviews' href='#reviews'>{candyInfo.numRatings} {candyInfo.numRatings > 1? 'Ratings' : 'Rating'}</a>
            </div>
            <h2>Price: ${candyInfo&&candyInfo.price.toFixed(2)}</h2>
            <div className='add'>
              {currentUser&&(<div className='input-selection'>
                <p>You currently have {candyHave} units:</p>
                <label>
                  Purchase more:
                  <input
                    id='number'
                    name='number'
                    placeholder='quantity'
                  />
                </label>
              </div>)}
              {currentUser&&(<button onClick={changeCandy}> add to cart</button>)}
              {!currentUser&&(<h6> login for add candy to shopping cart</h6>)}
              <h3>There is {candyStock} left in stock</h3>
              <h5>{candyInfo&&candyInfo.descrption}</h5>
            </div>
          </div>
        </div>
      
          <h6>Reviews: </h6>
          <ul>
              {notBlank.map(e=>
              <li>
              <p>Review by {e.email}  on {e.date}</p>
              
              <p>Rating: {e.rating}</p>
              
              <p>Review: {e.review}</p>
            </li>
                 )}
          </ul>
     
      </div>
    )
  }
  else{
    return(
      <div className='Candy-body'>
        <img src = {candyInfo.image} width= {400} height = {400} alt = "Candy" />
        <h1>{candyInfo&&candyInfo.name}</h1>
        <h2>{makeStarRating(candyInfo.rating)}</h2>
        <br />
        <h2>Price: ${candyInfo&&candyInfo.price.toFixed(2)}</h2>
        <br />
        <h3>There is {candyStock} left</h3>
        <br />
        <h4>{candyInfo&&candyInfo.manufacturer}</h4>
        <h5>{candyInfo&&candyInfo.descrption}</h5>
        <div className='add'>
        {currentUser&&(<div className='input-selection'>
          <p>You currently have {candyHave} units</p>
          <label>
            Purchase more:
            <input
              id='number'
              name='number'
              placeholder='quantity'
            />
          </label>
        </div>)}
        {currentUser&&(<button onClick={changeCandy}> add to cart</button>)}
        {!currentUser&&(<h6> login for add candy to shopping cart</h6>)}
      </div>
      <div id="newReview">
      {currentUser&&(<div className='review-input'>
        <h6>Review this product</h6>
        <label htmlFor='rating'>
            Rating:
            <select name = "rating" id ="rating">
              <option value = "1">1</option>
              <option value = "2">2</option>
              <option value = "3">3</option>
              <option value = "4">4</option>
              <option value = "5">5</option>
            </select>
        <br/>
        </label>
          <label htmlFor ="review">
            Write a new Review:
            <input
              id='review'
              name='review'
              placeholder='Write a review on this product...'
            />
          </label>
        </div>)}
      {currentUser&&(<button onClick={reviewCandy}> Write Review</button>)}
      </div>
          <h6>Reviews: </h6>
          <ul id ="reviewList">
              {notBlank.map((e,index)=>
              <li key={`entry${index}`}>
              <p>Review by {e.email}  on {e.date}</p>
             
              <p>Rating: {e.rating}</p>
              
              <p>Review: {e.review}</p>
            </li>
                 )}
          </ul>
      </div>
    )
    
  }
  
};

export default Candy