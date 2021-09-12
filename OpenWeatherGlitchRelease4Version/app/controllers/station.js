"use strict";
const axios = require("axios");
const API_KEY = "b95a5034994166d2626e12efd72440d5";
const logger = require("../utils/logger");
const stationAnalytics = require("../utils/stationAnalytics");
const stations = require("../models/stations");
const uuid = require("uuid");
const moment = require("moment");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    const currentStation = stations.getStation(stationId);
    const viewData = {
      name: "Station",
      station: currentStation,
      stationSummary: stations.getStationSummary(
        currentStation,
        stationAnalytics
      )
    };
    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    logger.debug(`Deleting Reading ${readingId} from station ${stationId}`);
    stations.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stations.getStation(stationId);

    const newReading = {
      id: uuid.v1(),
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      time: moment().format("LLLL")
      // station:station, do not put this back it will cause json circular stringify error
      //readings: request.body,
    };
    logger.debug("New Reading = ", newReading);
    stations.addNewReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  },

  async addreport(request, response) {
    logger.info("rendering new report" + JSON.stringify(request.body));
    let report = {};
    const stationId = request.params.id;
    const currentStation = stations.getStation(stationId);
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentStation.latitude}&lon=${currentStation.longitude}&units=metric&appid=${API_KEY}`;
    const result = await axios.get(requestUrl);
    logger.info("############## Trends : " + result);
    if (result.status == 200) {
      const reading = result.data.current;
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.windChill = reading.feels_like;
      report.weatherIcon = reading.weather[0].main;
      report.tempTrend = [];
      report.pressureTrend = [];
      report.windSpeedTrend = [];
      report.trendLabels = [];
      report.id = uuid.v1();
      report.time = moment().format("LLLL");
      const trends = result.data.daily;
      logger.info("############## Trends : " + trends);
      for (let i = 0; i < trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        report.pressureTrend.push(trends[i].pressure);
        report.windSpeedTrend.push(trends[i].wind_speed);
        const date = new Date(trends[i].dt * 1000);
        console.log(date);
        report.trendLabels.push(
          `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        );
      }
      stations.addNewReading(stationId, report);
    }
    const viewData = {
      title: "Weather Report",
      reading: report,
      station: currentStation,
      stationSummary: stations.getStationSummary(
        currentStation,
        stationAnalytics
      )
    };
    response.render("station", viewData);
    //response.redirect("/station/"+stationId  );
  }
};

module.exports = station;
