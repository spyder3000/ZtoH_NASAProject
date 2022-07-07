const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo.js");

function isHabitablePlanet(planet) {
	return (
		planet["koi_disposition"] === "CONFIRMED" &&
		planet["koi_insol"] > 0.36 &&
		planet["koi_insol"] < 1.11 &&
		planet["koi_prad"] < 1.6
	);
}

function loadPlanetsData() {
	return new Promise((resolve, reject) => {
		fs.createReadStream(
			path.join(__dirname, "..", "..", "data", "kepler_data.csv")
		)
			.pipe(
				parse({
					comment: "#",
					columns: true,
				})
			)
			.on("data", async (data) => {
				if (isHabitablePlanet(data)) {
					savePlanet(data);
				}
			})
			.on("error", (err) => {
				console.log("jverr100", err);
				reject(err); // for error
			})
			.on("end", async () => {
				const countPlanetsFound = (await getAllPlanets()).length;
				console.log(`${countPlanetsFound} habitable planets found!`);
				resolve(); // ends promise;
			});
	});
}

// abstracted fn -- puts all mongoose specific logic here, so main call will be removed from mongoose
async function getAllPlanets() {
	// param 1 if filter -- {} returns all planets;  param 2 is fields to return (1 include,);
	// return await planets.find( { keplerName: "Kepler-62 f", },	{ 'keplerName': 1 } 	);
	console.log("call getAllPlanets");
	let x = await planets.find(
		{},
		{
			_id: 0,
			__v: 0,
		}
	);
	console.log("jv560", x.length);
	return x;
}

// use .upsert() instead of .create() -- both are async mongoose;  data needs to be in format that matches Schema
// 2nd argument is object we're inserting / updating;  3rd param is upsert (to add if not exist)
async function savePlanet(planet) {
	try {
		await planets.updateOne(
			{
				keplerName: planet.kepler_name,
			},
			{
				keplerName: planet.kepler_name,
			},
			{ upsert: true }
		);
	} catch (err) {
		console.error(`Could not save planet ${err}`);
	}
}

module.exports = {
	loadPlanetsData,
	getAllPlanets,
};
