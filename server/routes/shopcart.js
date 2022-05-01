const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;
const bluebird = require('bluebird');
const axios = require('axios');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/usershopcart/:useremail', async (req, res) => {
  if(!req.params.useremail){
    res.status(400).json({ error: 'You must provide the user email' });
    return;
  }
  if(typeof(req.params.useremail) !== 'string'){
    res.status(400).json({error: 'Wrong type of useremail'})
    return;
  }
  if(req.params.useremail.trim().length ===0){
    res.status(400).json({error:'The useremail can not be all white space'})
    return
  }
  const useremail = req.params.useremail
  const checkemail = await client.existsAsync(useremail);
  if(checkemail === 1 ){
    //console.log("redis")
    let fitFromRedis = await client.lrangeAsync(useremail, 0 , -1)
    //console.log(fitFromRedis)
    const imagePosts1 = fitFromRedis.map( (photo) => {
      photo = JSON.parse(photo)
      return {
      id: photo.id,
      name: photo.name,
      price: photo.price,
      image:photo.image,
      numbers: photo.numbers
    } } );
    //let getData= JSON.parse(fitFromRedis);
    //console.log(imagePosts1)
    res.json(imagePosts1)
    return
  }
  else{
    res.json([])
  }
})

router.put('/usershopcart/:useremail', async (req, res) => {
  const candyInfo = req.body;
  //console.log(req.body)
  const useremail = req.params.useremail
  //console.log(useremail)
  if(!req.params.useremail){
    res.status(400).json({ error: 'You must provide the user email' });
    return;
  }
  if(typeof(req.params.useremail) !== 'string'){
    res.status(400).json({error: 'Wrong type of useremail'})
    return;
  }
  if(req.params.useremail.trim().length ===0){
    res.status(400).json({error:'The useremail can not be all white space'})
    return
  }
  if(!req.body){
    res.status(400).json({ error: 'You must provide the detail' });
    return;
  }
  const checkId = await client.existsAsync(useremail);
  if(checkId === 1 ){
    //console.log("redis")
    let fitFromRedis = await client.lrangeAsync(useremail, 0 , -1)
    let num 
    fitFromRedis = unflatten(fitFromRedis)
    let changeData = await fitFromRedis.filter((e, ind) => {
      e = JSON.parse(e)
      if (e.id === candyInfo.id){
        num = ind
        return [0]
      }
    })
    console.log(num)
    if(num != undefined|| num != null){
      const cchangeData = JSON.parse(changeData[0])
      let nameed = cchangeData.name
      let priceed = cchangeData.price
      let imageed = cchangeData.image
      let numbersed = cchangeData.numbers
      if (candyInfo.name!=undefined ||candyInfo.name!=null){
          nameed= candyInfo.name
      }
      if (candyInfo.price!=undefined || candyInfo.price!=null){
        priceed = candyInfo.price
      }
      if (candyInfo.image!=undefined || candyInfo.image!=null){
        imageed = candyInfo.image
      }
      if (candyInfo.numbers!=undefined || candyInfo.numbers!=null){
        numbersed = candyInfo.numbers
      }
      let newcandy = {
          id: candyInfo.id,
          name:nameed,
          price:priceed,
          image:imageed,
          numbers:numbersed
      }
      let return11 = await client.lsetAsync(useremail, num , JSON.stringify(newcandy))
      return res.json(newcandy)
    }
    else{
      let newcandy = {
        id: candyInfo.id,
        name:candyInfo.name,
        price:candyInfo.price,
        image:candyInfo.image,
        numbers:candyInfo.numbers
      }
      let return11 = await client.lpushAsync(useremail, JSON.stringify(newcandy))
      return res.json(newcandy)
    }
  }
  else{
    let newcandy = {
      id: candyInfo.id,
      name:candyInfo.name,
      price:candyInfo.price,
      image:candyInfo.image,
      numbers:candyInfo.numbers
  }
  let addcandy = await client.lpushAsync(useremail, JSON.stringify(newcandy))
  return res.json(newcandy)
  }
})

router.delete('/usershopcart/:useremail', async (req, res) => {
  if(!req.params.useremail){
    res.status(400).json({ error: 'You must provide the user email' });
    return;
  }
  if(typeof(req.params.useremail) !== 'string'){
    res.status(400).json({error: 'Wrong type of useremail'})
    return;
  }
  if(req.params.useremail.trim().length ===0){
    res.status(400).json({error:'The useremail can not be all white space'})
    return
  }
  const useremail = req.params.useremail
  let del = await client.delAsync(useremail)
  return res.json(del)
})

router.delete('/usershopcartid/:useremail', async (req, res) => {
  const cid = req.body.id
  if(!req.params.useremail){
    res.status(400).json({ error: 'You must provide the user email' });
    return;
  }
  if(typeof(req.params.useremail) !== 'string'){
    res.status(400).json({error: 'Wrong type of useremail'})
    return;
  }
  if(req.params.useremail.trim().length ===0){
    res.status(400).json({error:'The useremail can not be all white space'})
    return
  }
  if(!req.body.id){
    res.status(400).json({ error: 'You must provide the id' });
    return;
  }
  if(typeof(req.body.id) !== 'string'){
    res.status(400).json({error: 'Wrong type of id'})
    return;
  }
  if(req.body.id.trim().length ===0){
    res.status(400).json({error:'The id can not be all white space'})
    return
  }
  const useremail = req.params.useremail
  let getfromr = await client.lrangeAsync(useremail, 0 , -1)
  let num 
  getfromr = unflatten(getfromr)
  let changeData = getfromr.filter((e, ind) => {
      e = JSON.parse(e)
      if (e.id === cid){
          num = ind
          return [0]
      }
  })
  //console.log(num)
  //console.log(changeData)
      //console.log(changeData)
  let return11 = await client.LREMAsync(useremail, 0 ,  changeData[0])
  return res.status(200).json(JSON.parse(changeData[0]))
})


module.exports = router;