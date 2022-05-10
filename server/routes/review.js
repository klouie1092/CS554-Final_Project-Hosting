const express = require('express');
const router = express.Router();
const reviewData = require('../data/reviews')
const xss = require('xss');





router.post('/',async(req,res)=>{
    
    let candyIdRoutes = xss(req.body.candyId);
    let emailRoutes = xss(req.body.email);
    let reviewRoutes = xss(req.body.review);
    let ratingRoutes = xss(req.body.rating)
    
    if(!candyIdRoutes){
        res.status(400).json({error:'No Candy ID was provided'});
        return
    }
    if(!emailRoutes){
        res.status(400).json({error:'No email was provided'});
        return
    }
    if(!reviewRoutes){
        res.status(400).json({error:'No review was provided'});
        return
    }
    if(!ratingRoutes){
        res.status(400).json({error:'No rating was provided'});
        return
    }
    if(typeof reviewRoutes !='string'){
        res.status(400).json({error:'Review provided is not a string'});
        return
      }
      if(typeof emailRoutes!='string'){
        res.status(400).json({error:'Email provided is not a string'});
        return
      }
      if(typeof parseInt(ratingRoutes)===NaN){
        res.status(400).json({error:'Rating provided is not a number'});
        return
      }
    if(emailRoutes.trim(' ').length===0){
        res.status(400).json({error:'Email cannot contain only whitespaces'});
        return
        
    }
    if(parseInt(ratingRoutes) <1 || parseInt(ratingRoutes) > 5 ){
        res.status(400).json({error:"Rating provided is not valid"})
        return
    }
    
    try{
    const postingReview = await reviewData.createReview(candyIdRoutes,emailRoutes,reviewRoutes,parseInt(ratingRoutes));
    if(postingReview){
        res.status(200).json(postingReview);
        return
    }
    }catch(e){
        res.status(400).json({error:e});
        return
    }
})

router.post('/delete',async(req,res)=>{
    
    let candyIdRoutes = xss(req.body.candyId);
    let emailRoutes = xss(req.body.email);
   
 
    
    if(!candyIdRoutes){
        res.status(400).json({error:'No Candy ID was provided'});
        return
    }
    if(!emailRoutes){
        res.status(400).json({error:'No email was provided'});
        return
    }

      if(typeof emailRoutes!='string'){
        res.status(400).json({error:'Email provided is not a string'});
        return
      }
     
    if(emailRoutes.trim(' ').length===0){
        res.status(400).json({error:'Email cannot contain only whitespaces'});
        return
    }
  
    try{
    const deletingReview = await reviewData.deleteReview(candyIdRoutes,emailRoutes);
    
    if(deletingReview){
        res.status(200).json(deletingReview);
        return
    }
    }catch(e){
        res.status(400).json({error:e});
        return
    }
})

module.exports = router;