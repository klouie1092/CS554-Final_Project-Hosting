import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles
} from '@material-ui/core';

import '../App.css';

const useStyles = makeStyles({
  card: {
    maxWidth: 350,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const CandyList = () =>{
  const [candyData, setCandyData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteCandy, setFilteCandy] = useState('');
  const params = useParams();

  const classes = useStyles();


  useEffect(() => {
      async function fetchData() {
        try {
          const {data} = await axios.get('http://localhost:4000/Candies');
          setCandyData(data);
          if (params.searchTerm) {
            setSearchTerm(params.searchTerm);
          } else {
            setSearchTerm('');
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [params]);


  const roundToHalf = (num) =>{
    return Math.round(num * 2) / 2;
  }
  
  const makeStarRating = (rating) => {
    rating = roundToHalf(rating);
    let content = [];
    for (let i = 0; i < 5; i++) {
      if (rating - i === .5) {
        content.push(<i className="fa fa-star-half-full checked" key={`star${i}`}/>);
      } else if (rating - i > 0) {
        content.push(<i className="fa fa-star checked" key={`star${i}`}/>);
      } else {
        content.push(<i className="fa fa-star-o checked" key={`star${i}`}/>);
      }
    }
    return content;
  }

  const buildCards = (candy) =>{
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={candy._id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link to={`/Candy/${candy._id}`}>
                <CardMedia
                  className={classes.media}
                  component='img'
                  image = {candy.image}
                  title = 'image'
                />
                <CardContent>
                  <h2>{candy.name}</h2>
                  <h2>{makeStarRating(candy.rating)} {candy.numRatings}</h2>
                  <h2>${candy.price.toFixed(2)}</h2>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
      </Grid>
    );
  }
  // card = candyData && candyData.map((eachCandy) =>{
  //   return buildCards(eachCandy);
  // })

  // return(
  //   <div>
  //       <SearchCandy searchValue={searchValue} />
  //       <br />
  //       <br />
  //       <Grid container className={classes.grid} spacing={5}>
  //         {card}
  //       </Grid>
  //   </div>
  // )  

  let returnVal = candyData&&candyData.filter(candy =>{
    if(searchTerm === '' && filteCandy === ''){
      return true;
    }
    if(candy.name.toLowerCase().includes(searchTerm.toLowerCase()) && filteCandy === ''){
      return true;
    }
    if(parseInt(filteCandy) < candy.rating && searchTerm === ''){
      return true;
    }
    if(candy.name.toLowerCase().includes(searchTerm.toLowerCase()) && parseInt(filteCandy) < candy.rating){
      return true;
    }
    return false
  });

  return(
    <div>
      {/*<input placeholder="Search For Candies" onChange={event => setSearchTerm(event.target.value)} /> */}
      <br />

      <label htmlFor='rating'>
        filter this by rating:
        <select name = "rating" id ="rating"  onChange={event => setFilteCandy(event.target.value)}>
          <option value = ""> </option>
          <option value = "0">1</option>
          <option value = "1">2</option>
          <option value = "2">3</option>
          <option value = "3">4</option>
          <option value = "4">5</option>
        </select>
      </label>
      <br />
      <br />
      <br />
        {
          returnVal&&returnVal.length > 0 ? 
            <Grid container className={classes.grid} spacing={5}>
              {returnVal.map((candy) =>(buildCards(candy)))}
            </Grid> :
            <p>No Results</p>
        }
    </div>
  );
};

export default CandyList;
