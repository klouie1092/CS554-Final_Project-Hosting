const express = require('express');
const router = express.Router();
const candyData = require('../data/candy');
let { ObjectId } = require('mongodb');
const xss = require('xss');


router.get('/Candies', async (req, res) =>{
    try{
        const candyList = await candyData.getAll();
        res.json(candyList);
    }
    catch(e){
        res.status(400).json({ error: 'restaurants not found' })
    }
});

router.get('/Candy/:id', async (req,res) =>{
    let candyId = xss(req.params.id);

    if(!candyId){
        res.status(400).json({error: '[candy Routes] candy id is not provided'})
    }
    if(typeof(candyId) !== 'string'){
        res.status(400).json({error: '[candy Routes] candy id type is not string'})
    }
    if(candyId.trim().length ===0){
        res.status(400).json({error: '[candy Routes] candy id can not be all space'})

    }
    if(!ObjectId.isValid(candyId)){
        res.status(400).json({error: '[candy Routes] candy id is not a valid Object ID'})

    }
    try{
        const search = await candyData.getById(candyId);
        res.json(search);
    }
    catch(e){
        res.status(400).json({ error: e });
    }

});


router.post('/Candy/searchByName', async (req,res) =>{
    let searchName = req.body;
    if(!searchName){
        res.status(400).json({error: '[candy Routes] search name is not provided'})
        return
    }
    if(typeof(searchName) !== 'string'){
        res.status(400).json({error: '[candy Routes] search name type is not string'})
        return
    }
    if(searchName.trim().length ===0){
        res.status(400).json({error: '[candy Routes] search name can not be all space'})
        return

    }
    try{
        const search = await candyData.getByName(searchName);
        res.json(search);
        return
    }
    catch(e){
        res.status(400).json({ error: e });
        return
    }
});

router.post('/Candies/updateStock', async (req,res) =>{
    let candyId = xss(req.body.id);
    let stockNumber = xss(req.body.newStockNumber);
    if (stockNumber === 0) stockNumber = -1;
    //console.log(req.body)
    
    //console.log(candyId)
    //console.log(stockNumber)
   // console.log(typeof(stockNumber))
    //console.log(stockNumber)
    if(!candyId){
        res.status(400).json({error: '[candy Routes] id is not provided'})
        return
    }
    if(typeof(candyId) !== 'string'){
        res.status(400).json({error: '[candy Routes] candy id type is not string'})
        return
    }
    if(candyId.trim(' ').length === 0){
        res.status(400).json({error: '[candy Routes] candy id can not be all space'})
        return
    }
    
    if(!stockNumber){
        res.status(400).json({error: '[candy Routes] stock number is not provided'})
        return
    }
    if(typeof(stockNumber) !== 'number'){
        res.status(400).json({error: '[candy Routes] stock number type is not number'})
        return
    }   
    try{
        
        console.log('hello')
        const updateStock = await candyData.updateStock(candyId,stockNumber);
         console.log('hello')
        if(updateStock.updateSuccess === true){
            res.status(200)
        }
        return
    }
    catch(e){
        res.status(400).json({ error: e });
    }
});

router.post('/Candies/stockDelete', async (req,res) =>{
    let candyId = xss(req.body.id);
    let stockNumber = xss(req.body.newStockNumber);

    if(!candyId){
        res.status(400).json({error: '[candy Routes] id is not provided'})
    }
    if(typeof(candyId) !== 'string'){
        res.status(400).json({error: '[candy Routes] candy id type is not string'})
    }
    if(candyId.trim().length ===0){
        res.status(400).json({error: '[candy Routes] candy id can not be all space'})
    }
    if(!stockNumber){
        res.status(400).json({error: '[candy Routes] stock number is not provided'})
    }
    if(typeof(stockNumber) !== 'number'){
        res.status(400).json({error: '[candy Routes] stock number type is not number'})
    }   
    try{
        const updateStock = await candyData.updateStock_delete(candyId,stockNumber);
        if(updateStock.updateSuccess === true){
            res.status(200)
        }
    }
    catch(e){
        res.status(400).json({ error: e });
    }
});



router.post('/Candy/searchByRating', async (req,res) =>{
    let searchRating = req.body;
    if(!searchRating){
        res.status(400).json({error: '[candy Routes] search number is not provided'})
    }
    if(typeof(searchRating) !== 'number'){
        res.status(400).json({error: '[candy Routes] search number type is not number'})
    }
    if(searchRating.trim().length ===0){
        res.status(400).json({error: '[candy Routes] search name can not be all space'})

    }
    try{
        const search = await candyData.getByRating(searchRating);
        res.json(search);
    }
    catch(e){
        res.status(400).json({ error: e });
    }

});

module.exports = router;