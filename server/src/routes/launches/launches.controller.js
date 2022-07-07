const {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query); // gets skip & limit from query object (fields page, limit)
	const launches = await getAllLaunches(skip, limit);
	return res.status(200).json(launches);
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

	scheduleNewLaunch(launch);
	console.log(launch);
	return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
	// req.params.id is always a string;  needs to be converted to an integer;
	const launchId = Number(req.params.id);

	const existsLaunch = await existsLaunchWithId(launchId);
	// if launch doesn't exist
	if (!existsLaunch) {
		return res.status(404).json({
			error: "Launch not found",
		});
	}

	// if launch does exist;  aborted is launch that was aborted
	const aborted = await abortLaunchById(launchId);
	if (!aborted) {
		return res.status(400).json({
			error: "Launch not aborted",
		});
	}
	return res.status(200).json({
		ok: true,
	});
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
