const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();
// const launch = {
// 	flightNumber: 100, // flight_number
// 	mission: "Kepler Exploration X", // name
// 	rocket: "Explorer IS1", // corresponds to rocket.name in API request
// 	launchDate: new Date("December 27, 2030"), // date_local
// 	target: "Kepler-442 b", // not applicable
// 	customers: ["NASA", "ZTM"], // payload.customers for each payload (GET to payloads)
// 	upcoming: true, // upcoming
// 	success: true, // success
// };

// 1st param is index;  2nd param is object
// launches.set(launch.flightNumber, launch);
// saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
	console.log("Downloading launch data...");
	// param 1 is URL, param2 is body
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	if (response.status !== 200) {
		console.log("Problem downloading launch data");
		throw new Error("Launch data download failed");
	}

	// response.data is data from API response
	const launchDocs = response.data.docs;
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		// result is payload of nested customers will turn into a 1-dimension array
		const customers = payloads.flatMap((payload) => {
			return payload["customers"];
		});

		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers, // customers array is combined array of arrays into one array
		};

		console.log(`${launch.flightNumber} ${launch.mission}`);

		// TODO:  populate launches collection
		await saveLaunch(launch);
	}
}

async function loadLaunchData() {
	// checks that first Flight in SpaceX API is already in our mongo database
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});
	if (firstLaunch) {
		console.log("Launch data already loaded");
	} else {
		await populateLaunches();
	}
}

async function findLaunch(filter) {
	return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
	// return launches.has(launchId);
	// return await launchesDatabase.findOne({
	return await findLaunch({
		flightNumber: launchId,
	});
}

// use .sort() to find the largest flight number;  .findOne() returns just the one item
async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

	if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
	return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
	// return Array.from(launches.values());
	return await launchesDatabase
		.find(
			// find all documents
			{},
			{
				_id: 0,
				__v: 0,
			}
		)
		.sort({
			flightNumber: 1,
		})
		.skip(skip)
		.limit(limit);
}

// will update/insert
async function saveLaunch(launch) {
	await launchesDatabase.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{ upsert: true }
	);
}

async function scheduleNewLaunch(launch) {
	// verify that we are launching to a planet that exists
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error("No matching planet was found");
	}
	const newFlightNumber = (await getLatestFlightNumber()) + 1;
	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ["Zero to Mastery", "NASA"],
		flightNumber: newFlightNumber,
	});

	await saveLaunch(newLaunch);
}

// get specific launch & modify object properties for aborted
async function abortLaunchById(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	);
	console.log(aborted);
	return aborted.modifiedCount === 1;
}

module.exports = {
	loadLaunchData,
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
};
