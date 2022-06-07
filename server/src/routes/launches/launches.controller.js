const {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
	// launches is in Map() format;  need to convert this to json or an array to work with API;  Array.from() does this
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
	const launch = req.body; // because of app.use(express.json());  in app.js

	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.launchDate ||
		!launch.target
	) {
		return res.status(400).json({
			error: "Missing required launch property",
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: "Invalid launch date",
		});
	}

	addNewLaunch(launch);
	return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
	// req.params.id is always a string;  needs to be converted to an integer;
	const launchId = Number(req.params.id);

	// if launch doesn't exist
	if (!existsLaunchWithId(launchId)) {
		return res.status(404).json({
			error: "Launch not found",
		});
	}

	// if launch does exist;  aborted is launch that was aborted
	const aborted = abortLaunchById(launchId);
	return res.status(200).json(aborted);
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
