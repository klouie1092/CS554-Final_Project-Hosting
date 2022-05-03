import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";


const Candy = () =>{
    const [candyInfo, setCandyInfo] = useState(undefined)
    const params = useParams();


    useEffect(() => {
        async function fetchData() {
          try {
            let candyId = params.id
            const {data} = await axios.get('http://localhost:4000/Candy/' + candyId);
            setCandyInfo(data);
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
      }, []);

    if(candyInfo === undefined){
      return(
        <div>
          <h1>Sorry, there is no such candy</h1>
        </div>
      )
    }

    return(
      <div className='Candy-body'>
        <img src = {candyInfo.image} width= {400} height = {400} alt = "Candy image" />
        <h1>{candyInfo&&candyInfo.name}</h1>
        <br />
        <br />
        <h2>Price: ${candyInfo&&candyInfo.price}</h2>
        <br />
        <h3>There is {candyInfo&&candyInfo.stock} left</h3>
        <br />
        <h4>{candyInfo&&candyInfo.manufacturer}</h4>
        <h5>{candyInfo&&candyInfo.descrption}</h5>

      </div>
    )
};

export default Candy