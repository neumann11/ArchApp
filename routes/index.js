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
	res.render("register", {page: "register"});
});

// Handle sign up logic 
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	// create new user
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		// login new user
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to ArchApp " + user.username + "!");
			res.redirect("/projects");
		});
	});
});

// Show login form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});

// Handle login logic
router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect("/login"); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : "/projects"; // redirects to the target page prior to login.
      delete req.session.redirectTo;
      req.flash("success", "Welcome back, " + user.username + "!");
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

// router.post("/login", passport.authenticate("local", //passport.authenticate is middleware
// 	{

// 		successRedirect: "/projects",
// 		failureRedirect: "/login",
// 		failureFlash: true,
// 		successFlash: true
// 	}), function(req, res){ //this callback doesn't do anything and could be deleted.
// });

// Logout route
router.get("/logout", function(req, res){
	var username = req.user.username; // req.user.username doesn't exist anymore after you invoke req.logout()
	req.logout();
	req.flash("success", "Logged you out, " + username + "!");
	res.redirect("/projects");
});

module.exports = router;