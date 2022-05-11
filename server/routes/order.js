const express = require('express');
const router = express.Router();
const orderData = require('../data/orders')
const xss = require('xss');



router.post('/',async(req,res)=>{
    
    let emailRoutes = xss(req.body.email);
    let candy = [];
    let address = xss(req.body.address);
    let total =xss(req.body.total);
    let payment =xss(req.body.payment);
    xss(req.body.candy.forEach((e)=>{
        candy.push(e);
    }))
  
   
   
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
    
    
    if(candy.length ===0) { 
        res.status(400).json({error:'order must have a candy property'})
        return
    }
   
    
    
    
    if(!address) {
         res.status(400).json({error:'order must have an address property'})
         return
    }
   
    if(typeof address!=='string') {
        res.status(400).json({error:'order property of address must be a string'})
        return
    }
 
    if(!total) {
        res.status(400).json({error:'order must have a total property'})
        return
    } 
    
    if(!payment){
        res.status(400).json({error:'order must have a payment property'})
        return
    }
    
    

    
    try{
    
    const createdOrder = await orderData.createOrder(emailRoutes,candy,address,total,payment);
    
    if(createdOrder){
        res.status(200).json(createdOrder);
        return
    }
    }catch(e){
        res.status(400).json({error:e});
        return
    }
})

router.get('/:email', async (req, res) => {
    if(!req.params.email){
      res.status(400).json({ error: 'You must provide the user email' });
      return;
    }
    if(typeof(req.params.email) !== 'string'){
      res.status(400).json({error: 'Wrong type of useremail'})
      return;
    }
    if(req.params.email.trim().length ===0){
      res.status(400).json({error:'The useremail can not be all white space'})
      return
    }
    const user = req.params.email
    try{
    let pastOrders = await orderData.getPastOrders(user)
    
      res.status(200).json(pastOrders)
      return
      
    }catch(e){
        res.status(400).json({error:e});
        return
    }
   
  })

  module.exports = router;