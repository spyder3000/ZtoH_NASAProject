const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter); // middleware than handles routes to planets
api.use("/launches", launchesRouter); // middleware than handles routes to launches;  1st param limits this to just /launches path

module.exports = api;
