var express = require("express");
var router	= express.Router();
var Project = require("../models/project");
var middleware = require("../middleware");

// Google Maps
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - show all architecture projects
router.get("/", function(req, res){
	// Get all projects from DB,
	Project.find({}, function(err, allProjects){
		if(err) {
			console.log(err);
		} else {
			res.render("projects/index", {projects: allProjects, currentUser: req.user, page: "projects"});
		}
	});
});

// NEW ROUTE - show new form
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("projects/new");
})

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to projects array
	var name = req.body.name;
	var architects = req.body.architects;
	var location = req.body.location;
	var year = req.body.year;
	var image = req.body.image;
	var description = req.body.description;
	var source = req.body.source;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
	    if (err || !data.length) {
	      req.flash('error', 'Invalid address');
	      return res.redirect('back');
	    }
	    var lat = data[0].latitude;
	    var lng = data[0].longitude;
	    var location = data[0].formattedAddress;
		var newProject = {name: name, architects: architects, year: year, image: image, description: description, source: source, author: author, location: location, lat: lat, lng: lng};
		// create new project and save to DB
		Project.create(newProject, function(err, newlyCreated) {
			if(err) {
				console.log(err);
			} else {
				// redirect back to campgrounds page (by default to get request);
				res.redirect("/projects");
			}
		});
	});
});	

// SHOW ROUTE
router.get("/:id", function(req, res){
	// Find the campground with provided id
	Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
		if(err) {
			console.log(err);
		} else {
			res.render("projects/show", {project: foundProject});
		}
	});
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		res.render("projects/edit", {project: foundProject});
	});
});

// UPDATE ROUTE
router.put("/:id", middleware.checkProjectOwnership, function(req, res) {
	geocoder.geocode(req.body.location, function (err, data) {
	    if (err || !data.length) {
	    	console.log(err)
	    	req.flash('error', 'Invalid address');
	    	return res.redirect('back');
	    }
	    var lat = data[0].latitude;
	    var lng = data[0].longitude;
	    var location = data[0].formattedAddress;
	    var newData = {name: req.body.project.name, architects: req.body.project.architects, year: req.body.project.year, image: req.body.project.image, description: req.body.project.description, source: req.body.project.source, author: req.body.project.author, location: location, lat: lat, lng: lng};
	    // {name: name, architects: architects, year: year, image: image, description: description, source: source, author: author, location: location, lat: lat, lng: lng};
		Project.findByIdAndUpdate(req.params.id, newData, function(err, updatedProject){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success", "Successfully Updated!");
				res.redirect("/projects/" + req.params.id);
			}
		});
	});
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkProjectOwnership, function(req, res){
	Project.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res,redirect("/projects");
		} else {
			res.redirect("/projects");
		}
	});
});

module.exports = router;