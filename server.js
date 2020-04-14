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

let locData = require('./data/geo.json');
let city = request.query.city;
let formattedObj = new City(city, locData);

response.status(200).send(formattedObj);
});

function City(city, locData) {
  this.search_query = city;
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));