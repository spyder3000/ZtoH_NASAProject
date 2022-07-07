// const API_URL = "v1";
const API_URL = "http://localhost:8001/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
	console.log("httpGetPlanets");
	console.log(`${API_URL}/planets`);
	const response = await fetch(`${API_URL}/planets`);
	console.log(response);
	return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
	const response = await fetch(`${API_URL}/launches`);
	const fetchedLaunches = await response.json();
	return fetchedLaunches.sort((a, b) => {
		return a.flightNumber - b.flightNumber;
	});
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
	// console.log("httpSubmitLaunch");
	// console.log(launch);
	try {
		// POST request requires 2nd param that includes method & body (body must be a string);  returns ok: true by default
		return await fetch(`${API_URL}/launches`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(launch),
		});
	} catch (err) {
		return {
			ok: false,
		};
	}
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
	try {
		return await fetch(`${API_URL}/launches/${id}`, {
			method: "delete",
		});
	} catch (err) {
		console.log(err);
		// ok property checked in useLaunches.js to check success
		return {
			ok: false,
		};
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
