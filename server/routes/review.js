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
        
    }
    if(!emailRoutes){
        res.status(400).json({error:'No email was provided'});
        
    }
    if(!reviewRoutes){
        res.status(400).json({error:'No review was provided'});
        
    }
    if(!ratingRoutes){
        res.status(400).json({error:'No rating was provided'});
        
    }
    if(typeof reviewRoutes !='string'){
        res.status(400).json({error:'Review provided is not a string'});
      }
      if(typeof emailRoutes!='string'){
        res.status(400).json({error:'Email provided is not a string'});
      }
      if(typeof parseInt(ratingRoutes)===NaN){
        res.status(400).json({error:'Rating provided is not a number'});
      }
    if(emailRoutes.trim(' ').length===0){
        res.status(400).json({error:'Email cannot contain only whitespaces'});
        
    }
    if(parseInt(ratingRoutes) <1 || parseInt(ratingRoutes) > 5 ){
        res.status(400).json({error:"Rating provided is not valid"})
    }
    
    try{
    const postingReview = await reviewData.createReview(candyIdRoutes,emailRoutes,reviewRoutes,parseInt(ratingRoutes));
    if(postingReview){
        res.json(postingReview);
    }
    }catch(e){
        res.status(400).json({error:e});
    }
})

router.post('/delete',async(req,res)=>{
    
    let candyIdRoutes = xss(req.body.candyId);
    let emailRoutes = xss(req.body.email);
   
 
    
    if(!candyIdRoutes){
        res.status(400).json({error:'No Candy ID was provided'});
        
    }
    if(!emailRoutes){
        res.status(400).json({error:'No email was provided'});
        
    }

      if(typeof emailRoutes!='string'){
        res.status(400).json({error:'Email provided is not a string'});
      }
     
    if(emailRoutes.trim(' ').length===0){
        res.status(400).json({error:'Email cannot contain only whitespaces'});
        
    }
  
    try{
    const deletingReview = await reviewData.deleteReview(candyIdRoutes,emailRoutes);
    
    if(deletingReview){
        res.json(deletingReview);
    }
    }catch(e){
        res.status(400).json({error:e});
    }
})

module.exports = router;