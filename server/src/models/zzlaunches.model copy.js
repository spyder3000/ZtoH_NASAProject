// used through ch 162

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration X",
	rocket: "Explorer IS1",
	launchDate: new Date("December 27, 2030"),
	target: "Kepler-442 b",
	customers: ["NASA", "ZTM"],
	upcoming: true,
	success: true,
};

// 1st param is index;  2nd param is object
launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
	return launches.has(launchId);
}

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	// want to get last flightNumber & increase by 1 for new launch
	latestFlightNumber += 1;
	// launches.set(latestFlightNumber, { ...launch, flightNumber: latestFlightNumber, upcoming: true, success: true, customers: ["Z to M", "NASA"] });
	// Object.assign copies all properties from a source (param 2) to a target (param 1) result is modified launch object;
	//    could probably use ... instead
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			flightNumber: latestFlightNumber,
			upcoming: true,
			success: true,
			customers: ["Zero to Mastery", "NASA"],
		})
	);
}

// get specific launch & modify object properties for aborted
function abortLaunchById(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;
	return aborted;
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
};
