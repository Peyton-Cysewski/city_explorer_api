'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
app.use(cors());
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

const dbClient = new pg.Client(process.env.DATABASE__URL);

dbClient.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});


// Getting Location
app.get('/location', (request, response) => {

  const search = request.query.city;
  const key = process.env.LOCATIONIQ__API__KEY
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${search}&format=json`

  superagent
  .get(url)
  .then(locResponse => {response.status(200).send(new City(search, locResponse.body[0]))})
  .catch(handleError);

  });

// Getting Weather
app.get('/weather', (request, response) => {

  const { latitude, longitude } = request.query;
  const key = process.env.WEATHERBIT__API__KEY
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${key}`

  superagent
  .get(url)
  .then(weatherResponse => {
    let data = weatherResponse.body.data;
    response.status(200).send(data.map(day => new Weather(day.weather.description, day.datetime)))})
  .catch(handleError);

});

// Getting Trails
app.get('/trails', (request, response) => {

  const { latitude, longitude } = request.query;
  const key = process.env.HIKINGPROJ__API__KEY;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=${key}`

  superagent
  .get(url)
  .then(trailResponse => {
    let data = trailResponse.body.trails;
    console.log(data);
    response.status(200).send(data.map(trail => new Trail(trail)))})
  .catch(handleError);

});

// Constructor Functions 
function City(city, locData) {
  this.search_query = city;
  this.formatted_query = locData.display_name;
  this.latitude = locData.lat;
  this.longitude = locData.lon;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();
}

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails;
  this.condition_date = split_conditionDate(trail.conditionDate)[0];
  this.condition_time = split_conditionDate(trail.conditionDate)[1];
}

// Extra Functions
function split_conditionDate(str) {
  return str.split(' ');
}

// Error Handler
function handleError(err, res) {
  console.log(err);
  response.status(500).send({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
}


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));