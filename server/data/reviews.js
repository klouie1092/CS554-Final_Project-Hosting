const mongoCollections = require("../config/mongoCollections");
const CandyCollection = mongoCollections.CandyData;
const { ObjectId } = require('mongodb');


async function createReview(candyId,email,review,rating){
   
    if(!candyId){
        throw 'No candy ID was provided'
      }
      if(typeof candyId!='string'){
        throw 'candy ID must be a string'
      }
      if(candyId.length==0){
        throw 'candy ID cannot be empty'
      }
      if(!review){
        throw 'No Review was provided'
      }
      if(!email){
        throw 'No email was provided'
      }
      if(typeof review !='string'){
        throw 'review must be a string'
      }
      if(typeof email!='string'){
        throw 'email must be a string'
      }
      if(email.trim(' ').length===0){
        throw 'Description cannot contain only whitespaces'
      }
      if(!rating){
          throw 'No rating was provided'
      }
      if(typeof parseInt(rating) === NaN){
          throw 'rating is not a number'
      }
      if((parseInt(rating) < 1)||(parseInt(rating)> 5)){
          throw 'rating must be between 1 and 5'
      }
    
   
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    rating = parseInt(rating);
    if(review.trim(' ').length===0) review = " ";
    let newReview = {
        email : email,
        review : review,
        rating : rating,
        date : today 
    }
    try{
    let candyCollection = await CandyCollection();
    
    let candy = await candyCollection.findOne({_id:ObjectId(candyId)});

    candy.reviews.forEach((review)=>{
        if(review.email === email)throw "User has already reviewed this product";
    });

    newTotalRating = (rating + (candy.numRatings*candy.rating))/ (candy.numRatings + 1);

    candy.reviews.push(newReview);

    const updatedInfo = await candyCollection.updateOne(
        { _id: ObjectId(candyId) },
        { $set: candy}
    );
    
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update candy successfully';
    }

    return newReview;
}catch(e){
    console.log("error: " + e)
}

}

async function deleteReview(candyId,email){
  
  if(!candyId){
    throw 'No candy ID was provided'
  }
 
  if(typeof candyId!='string'){
    throw 'candy ID must be a string'
  }
  if(candyId.length==0){
    throw 'candy ID cannot be empty'
  }
  if(!email){
    throw 'No email was provided'
  }
  if(typeof email!='string'){
    throw 'email must be a string'
  }
  if(email.trim(' ').length===0){
    throw 'Description cannot contain only whitespaces'
  }
    let exists = false;
    let newReviews = [];
    try{
     
    let candyCollection = await CandyCollection();
   
    let candy = await candyCollection.findOne({_id:ObjectId(candyId)});
    let rating;
    candy.reviews.forEach((review)=>{
        if(review.email === email){
          exists = true;
          rating = review.rating;
        }
        else{
          newReviews.push(review);
        }
    });
    
    if(exists ===false) throw "This user has not reviewed this product";

    let deletedReview = {candyId: candyId,
      email:email}
    candy.reviews = newReviews;
    newTotalRating = ( (candy.numRatings*candy.rating) -rating)/ (candy.numRatings - 1);

    candy.reviews.push(newReview);
    candy.rating = newTotalRating;
    const updatedInfo = await candyCollection.updateOne(
      { _id: ObjectId(candyId) },
      { $set: candy}
  );
     
  
  if (updatedInfo.modifiedCount === 0) {
      throw 'could not update candy successfully';
  }

  return deletedReview;
}catch(e){
  console.log("error: " + e)
}
}

module.exports = {
    createReview,
    deleteReview
}
