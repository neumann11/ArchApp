var express			= require("express"),
	app				= express(),
	bodyParser		= require("body-parser"),
	mongoose		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Project 		= require("./models/project"),
	Comment			= require("./models/comment"),
	User			= require("./models/user");

// REQUIRING ROUTES
var indexRoutes		= require("./routes/index"),
	projectRoutes	= require("./routes/projects");
	commentRoutes	= require("./routes/comments");

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

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This will be a great website",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user; //check current user on every route(login, logout, signup buttons; user display): 
	res.locals.error = req.flash("error"); // flash messages dispaly error
	res.locals.success = req.flash("success"); // flash messages dispaly success
	next();
});

// USE ROUTERS
app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("Server started");
});