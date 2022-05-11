const mongoCollections = require("../config/mongoCollections");
const orders = mongoCollections.OrderData;
const { ObjectId } = require('mongodb');
async function createOrder(email,candy,address,total,payment){
    
    if(!email){
        throw 'No email was provided'
      }
      
     if(typeof email!='string'){
        throw 'email must be a string'
      }
      
      if(email.trim(' ').length===0){
        throw 'email cannot contain only whitespaces'
      }
     
      if(!candy) throw 'must provide candy'
      
      if(!Array.isArray(candy)) throw 'candy be an array'
     
      if(!address) throw 'No address was provided';
      if(typeof address!=='string') throw 'address must be a string';
      if(!total) throw 'total must be provided'
    
      if(typeof parseFloat(total) ===NaN) throw 'total must be a number'
      
      if(!payment) throw 'payment must be provided';
      if(typeof parseInt(payment) === NaN) throw "payment must be a number"
      
      if(payment.length !== 4) throw 'Payment must be the last 4 digits of a credit card'
     
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
      let newOrder = {
          email: email,
          order : {
            candy:candy,
            address:address,
            total:total,
            payment:payment
          },
          date : today
      }

      try{
          let orderCollection = await orders();
          let createData = await orderCollection.insertOne(newOrder);
          if(!createData) throw "Could not create new order successfully"
          return newOrder
      }catch(e){
          console.log("error: " +e );
      }
    }

    async function getPastOrders(email){
      if(!email){
        throw 'No email was provided'
      }
     if(typeof email!='string'){
        throw 'email must be a string'
      }
      if(email.trim(' ').length===0){
        throw 'email cannot contain only whitespaces'
      }

      try{
        let orderCollection = await orders();
        let pastOrders= await orderCollection.find({email: email}).toArray();
        
        
        if(!pastOrders){
          return "";
        }
        else {
          //console.log('FOUND')
          return pastOrders
        }
      }catch(e){
        console.log("error: " +e );
      }

    }

    module.exports = {
        createOrder,
        getPastOrders
    }


     
    