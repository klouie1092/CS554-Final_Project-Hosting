const express = require('express');
const router = express.Router();
const candyData = require('../data/candy');
let { ObjectId } = require('mongodb');

router.get('/Candy', async (req, res) =>{
    try{
        const candyList = await candyData.getAll();
        res.json(candyList);
    }
    catch(e){
        res.status(400).json({ error: 'restaurants not found' })
    }
});

router.post('/Candy/searchById', async (req,res) =>{
    let searchId = req.body;
    if(!searchId){
        res.status(400).json({error: '[candy Routes] search id is not provided'})
    }
    if(typeof(searchId) !== 'string'){
        res.status(400).json({error: '[candy Routes] search id type is not string'})
    }
    if(searchId.trim().length ===0){
        res.status(400).json({error: '[candy Routes] search id can not be all space'})

    }
    if(!ObjectId.isValid(searchId)){
        res.status(400).json({error: '[candy Routes] search id is not a valid Object ID'})

    }
    try{
        const search = await candyData.getById(searchId);
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