const http = require("http");
const app = require("./app");
require("dotenv").config();

const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8001;

const server = http.createServer(app);

// allows time to populate our data (as found in models/planets.model) before listening on the server
async function startServer() {
	await mongoConnect();
	await loadPlanetsData(); // because of await, needed to wrap this in async fn
	await loadLaunchData();
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}...`);
	});
}

startServer();
