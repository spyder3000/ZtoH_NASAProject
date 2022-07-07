// this modules separates express middlware from our server fns
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express(); // express is just middleware - a listener function for http fn

// w/out origin, would allow all cross-origin requests from anywhere on internet.
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

// app.use(morgan("combined"));   // gives Log data of all HTTP requests

app.use(express.json()); // will parse any incoming JSON from body of incoming requests

// the needed path for this now that we've moved the build to server\public via package.json on client
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);

app.get("/*", (req, res) => {
	console.log(
		"JV = " + path.join(__dirname, "..", "public", "build", "index.html")
	);
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
