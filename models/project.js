var mongoose = require("mongoose");

// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
	name: String,
	// createdAt: { type: Date, default: Date.now },
	architects: String,
	location: String,
	year: Number,
	image: String,
	source: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Project", projectSchema);