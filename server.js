'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;


app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

// Getting a location
app.get('/location', (request, response) => {

let locationData = require('./data/geo.json');
let city = request.query.city;
let formattedObj = new City(city, locationData);

response.status(200).send(formattedObj);
});

// Getting a location's Weather
app.get('/weather', (request, response) => {
  let empty = [];

  let weatherData = require('./data/darksky.json')
  weatherData.data.forEach(item => {
    let forecast = item.weather.description;
    let time = new Date(item.valid_date).toDateString();
    let formattedObj = new Weather(forecast,time); 
    
    empty.push(formattedObj)
  });
  response.status(200).send(empty);
  });

// Constructor Functions 
function City(city, locData) {
  this.search_query = city;
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));