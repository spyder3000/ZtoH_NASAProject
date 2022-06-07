const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// allows time to populate our data (as found in models/planets.model) before listening on the server
async function startServer() {
	await loadPlanetsData(); // because of await, needed to wrap this in async fn
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}...`);
	});
}

startServer();
