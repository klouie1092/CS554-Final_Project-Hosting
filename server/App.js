const express = require('express');
const app = express();
const configRoutes = require('./routes');
//cors = require("cors")
const cors = require('cors');
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
const corsOptions ={
    //origin:'http://localhost:3000', 
    origin:'https://klouie1092.github.io', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Origin", "https://klouie1092.github.io"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(cors())
configRoutes(app);
app.listen(process.env.PORT || 4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});