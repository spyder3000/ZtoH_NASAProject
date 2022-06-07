const express = require("express");

// const launchesController = require("./launches.controller");
const {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
