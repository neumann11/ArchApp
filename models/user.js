var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

// add methods to the user
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);