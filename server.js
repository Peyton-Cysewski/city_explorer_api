'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;


app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

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

  // console.log(request.query);
  // const search = request.query.search_query;
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

// Error Handler
function handleError(err, res) {
  console.log(err);
  response.status(500).send({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
}


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));