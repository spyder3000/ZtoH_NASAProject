const express = require("express");
// const planetsController = require("./planets.controller");
const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", httpGetAllPlanets);

// grouping all planet related routes
module.exports = planetsRouter;
