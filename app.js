var express			= require("express"),
	app				= express(),
	bodyParser		= require("body-parser"),
	mongoose		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override");

// APP CONFIG
// local development database:
var url = process.env.DATABASEURL || "mongodb://localhost/arch_app"
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.listen(3000, function(){
	console.log("Server started");
});