import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";
import { AuthContext } from '../firebase/Auth';
import '../Candy.css';

const Candy = () =>{
  const {currentUser} = useContext(AuthContext);
  const [candyInfo, setCandyInfo] = useState(undefined)
  const [candyHave, setCandyHave] = useState(0)
  const [candyStock, setCandyStock] = useState(0)
  const [userReview,setUserReview] = useState(undefined)


  const [ loading, setLoading ] = useState(true);
  const params = useParams();
  const intn = /^\+?[1-9][0-9]*$/;

  const [reviewRating, setReviewRating] = useState(0);
  const veganCheck = 'https://iamgoingvegan.b-cdn.net/wp-content/uploads/2020/05/European-Vegetarian-Symbol-961x1024.png'


  useEffect(() => {
    async function fetchData() {
      try {
        let candyId = params.id
        const {data} = await axios.get('http://localhost:4000/Candy/' + candyId);
        setCandyInfo(data);
        setCandyStock(data.stock)
      
        if(currentUser !== null){          
          data.reviews.forEach((e)=>{
            if(e.email === currentUser.email) setUserReview(e)
          });
          
          const have = await axios.get('http://localhost:4000/usershopcart/' + currentUser.email)
          let changeData = await have.data.filter((e) => {
            return e.id === candyId
          })
          
          if(changeData.length !== 0 && changeData[0].numbers){
            setCandyHave(changeData[0].numbers)
          }
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [candyHave, currentUser, params.id]);

  const reviewCandy = async () =>{
    let rating = reviewRating;
    if (rating === 0) {
      alert("Please enter a Rating");
      return;
    }
    let review = document.getElementById('review').value;
    if(!review){
      review = " ";
    }
    if(review.trim(' ').length === 0) review = " ";
    let email = currentUser.email;
    let candyId = candyInfo._id;
    
    try{
      await axios.post('http://localhost:4000/review',{
        candyId: candyId,
        email: email,
        review: review,
        rating: rating
      });
      
      document.getElementById('review').value='';
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); 
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;
      let  newReview = {
        candyId: candyId,
        email: email,
        review: review,
        rating: rating,
        date: today
      }
      setUserReview(newReview);
    }catch(e){
      alert(e);
    }
  }

  const deleteReview = async()=>{
    try{

      await axios.post('http://localhost:4000/review/delete',{
        candyId: candyInfo._id,
        email: currentUser.email,
      });
      
      setUserReview(undefined);
      setReviewRating(0);
    } catch(e){
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
      const updateInformation = {id:params.id, newStockNumber: newStock}
      try{
        await axios.put('http://localhost:4000/usershopcart/'+ currentUser.email, body,)
        .then(res=>{
          setCandyHave(res.data.numbers)
          setCandyStock(newStock)
        })
        alert(`You successfully purchased ${numberha1} units`)
        await axios.post('http://localhost:4000/Candies/updateStock', updateInformation)
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

  
  const changeRating = (num) => {
    setReviewRating(num);
  }


  
  
  if(loading){
    return (
			<div>
				<h2>Loading...</h2>
			</div>
		);
  }
  else{
    if(candyInfo === undefined){
      return(
        <div>
          <h1>Sorry, there is no such candy</h1>
        </div>
      )
    }
    else{
      let notBlank= [];   
      candyInfo.reviews.forEach((e)=>{
        if(currentUser){
          if(e.email !== currentUser.email){
            if(e.review.trim(' ').length!==0) notBlank.push(e);
          } 
        }
        else{
          if(e.review.trim(' ').length!==0) notBlank.push(e);
        } 
      });    
 
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
                <div className='starsBig'>{makeStarRating(candyInfo.rating)}</div>
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
                {!currentUser&&(<p> Must be logged in to add candy to shopping cart</p>)}
                <h3>There is {candyStock} left in stock</h3>
                <p>{candyInfo&&candyInfo.descrption}</p>
              </div>
            </div>
          </div>

          {!userReview&&currentUser&&(<div id="newReview">
            <div className='review-input'>
              <h3>Review this product</h3>
              <div className="star-rating">
                <input type="radio" name="stars" id="star-a" value="5" onClick={() => changeRating(5)}/>
                <label htmlFor="star-a"></label>

                <input type="radio" name="stars" id="star-b" value="4" onClick={() => changeRating(4)}/>
                <label htmlFor="star-b"></label>
            
                <input type="radio" name="stars" id="star-c" value="3" onClick={() => changeRating(3)}/>
                <label htmlFor="star-c"></label>
            
                <input type="radio" name="stars" id="star-d" value="2" onClick={() => changeRating(2)}/>
                <label htmlFor="star-d"></label>
            
                <input type="radio" name="stars" id="star-e" value="1" onClick={() => changeRating(1)}/>
                <label htmlFor="star-e"></label>
              </div>
                <label htmlFor ="review">
                  Write a new Review:
                  <textarea
                    cols="40" rows="5"
                    id='review'
                    name='review'
                    placeholder='Write a review on this product...'
                  />
                </label>
              </div>
            <button onClick={reviewCandy}> Write Review</button>
          </div>)}
          {userReview&&currentUser&&(<div id="userReview">
              <h3>Your Review</h3>
        
                <p>Review by {userReview.email}  on {userReview.date}</p>
                
                <p>{makeStarRating(userReview.rating)}</p>
                
                <p>Review: {userReview.review}</p>

                <button onClick={deleteReview}>Delete Review</button>
              </div>)}
          <p><b>Reviews: </b></p>
          <ul id="reviewList">
            {notBlank.map(e=>
              <li>
                <p>Review by {e.email}  on {e.date}</p>
                
                <p>{makeStarRating(e.rating)}</p>
                
                <p>Review: {e.review}</p>
              </li>
            )}
          </ul>
        </div>
      )
    }
  }
};


export default Candy;