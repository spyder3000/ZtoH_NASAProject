const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
	keplerName: {
		type: String,
		required: true,
	},
});

// 1st param should always be singular name of Collection;
//   mongoose.mode  connects planetSchema with the "planets" (plural) collection
module.exports = mongoose.model("Planet", planetSchema);
