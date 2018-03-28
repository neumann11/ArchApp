var express = require("express");
var router	= express.Router();
var Project = require("../models/project");

// INDEX - show all architecture projects
router.get("/", function(req, res){
	// Get all projects from DB,
	Project.find({}, function(err, allProjects){
		if(err) {
			console.log(err);
		} else {
			res.render("projects/index", {projects: allProjects});
		}
	});
});

// NEW ROUTE - show new form
router.get("/new", function(req, res) {
	res.render("projects/new");
})

// CREATE ROUTE
router.post("/", function(req, res) {
	var name = req.body.name;
	var architects = req.body.architects;
	var location = req.body.location;
	var year = req.body.year;
	var image = req.body.image;
	var description = req.body.description;
	var source = req.body.source;
	var newProject = {name: name, architects: architects, location: location, year: year, image: image, description: description, source: source};
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

module.exports = router;