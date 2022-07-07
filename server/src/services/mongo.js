const mongoose = require("mongoose");
require("dotenv").config();

// includes user & pwd & cluster w/ address;
const MONGO_URL = process.env.MONGO_URL;

// mongoose.connection is an event emitter;  once is so open event only gets triggered once
mongoose.connection.once("open", () => {
	console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (error) => {
	console.error(error);
});

async function mongoConnect() {
	// connect to MongoDB before our server starts listening
	await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
	await mongoose.disconnect(MONGO_URL);
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
};
