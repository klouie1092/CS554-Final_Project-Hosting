const express = require('express');
const router = express.Router();
const candyData = require('../data/candy');
let { ObjectId } = require('mongodb');

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
    let candyId = req.params.id;

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
    }
    if(typeof(searchName) !== 'string'){
        res.status(400).json({error: '[candy Routes] search name type is not string'})
    }
    if(searchName.trim().length ===0){
        res.status(400).json({error: '[candy Routes] search name can not be all space'})

    }
    try{
        const search = await candyData.getByName(searchName);
        res.json(search);
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