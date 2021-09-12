"use strict";

//Error handler for station input
const Station = function(name, latitude, longitude) {
  this.name = name;
  this.latitude = latitude;
  this.longitude = longitude;
  this.errors = [];
};
Station.prototype.validateUserInput = function() {
  if (this.name === "") {
    this.errors.push("Please enter the name of the city");
  } else if (this.name > 0 || this.name <= 0) {
    this.errors.push("Name of the city cannot be a number");
  } else if (this.latitude === "") {
    this.errors.push("Please enter a valid latitude number"); // is possible to add more validation with number entry as below
  } else if (isNaN(this.latitude)) {
    this.errors.push("Latitude cannot be a word");
  } else if (this.longitude === String) {
    this.errors.push("Please enter a valid longitude number");
  } else if (isNaN(this.longitude)) {
    this.errors.push("Longitude cannot be a word");
  } else if (this.latitude < -90 || this.latitude > 90) {
    this.errors.push("Latitude ranges from -90 to 90 only");
  } else if (this.longitude < -180 || this.longitude > 180) {
    this.errors.push("Longitude ranges from -180 to 180 only");
  }
};
module.exports = Station;
