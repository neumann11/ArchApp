var express = require("express");
var router	= express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");	

// ROOT Router
router.get("/", function(req, res) {
	res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
	res.render("register");
});

// Handle sign up logic 
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	// create new user
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register");
		}
		// login new user
		passport.authenticate("local")(req, res, function(){
			res.redirect("/projects");
		});
	});
});

// Show login form
router.get("/login", function(req, res){
	res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", //passport.authenticate is middleware
	{
		successRedirect: "/projects",
		failureRedirect: "/login",
	}), function(req, res){ //this callback doesn't do anything and could be deleted.
});

// Logout route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/projects");
});

module.exports = router;