import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
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
    const classes = useStyles();


    useEffect(() => {
        async function fetchData() {
          try {
            const {data} = await axios.get('http://localhost:4000/Candies');
            setCandyData(data);
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
      }, []);

    const buildCards = (candy) =>{
        return(
            <Grid item xs={12} sm={12} md={4} lg={3} xl={12} key={candy._id}>
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
                                <Typography
                                className={classes.titleHead}
                                gutterBottom
                                variant='h6'
                                component='h3'
                                >
                                {candy.name}
                                </Typography>   
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    let card  = candyData && candyData.map((eachCandy) =>{
        return buildCards(eachCandy);
    })

    return(
        <div>{card}</div>
    )    

    

  }

  export default CandyList;