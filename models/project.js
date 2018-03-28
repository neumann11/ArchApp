var mongoose = require("mongoose");

// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
	name: String,
	createdAt: { type: Date, default: Date.now },
	Architects: String,
	Location: String,
	Year: Number,
	Image: String,
	Source: String,
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