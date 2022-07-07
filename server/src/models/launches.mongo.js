const mongoose = require("mongoose");

// note that target refers to planet that has its own Schema
const launchesSchema = new mongoose.Schema({
	flightNumber: {
		type: Number,
		required: true,
	},
	mission: {
		type: String,
		required: true,
	},
	rocket: {
		type: String,
		required: true,
	},
	launchDate: {
		type: Date,
		required: true,
	},
	target: {
		type: String,
	},
	customers: [String],
	upcoming: {
		type: Boolean,
		required: true,
	},
	success: {
		type: Boolean,
		required: true,
		default: true,
	},
});

// 1st param should always be singular name of Collection;
//   this connects launchesSchema with the "launches" (plural) collection
module.exports = mongoose.model("Launch", launchesSchema);
