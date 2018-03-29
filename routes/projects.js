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

// SHOW ROUTE
router.get("/:id", function(req, res){
	// Find the campground with provided id
	Project.findById(req.params.id, function(err, foundProject){
		if(err) {
			console.log(err);
		} else {
			res.render("projects/show", {project: foundProject});
		}
	});
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		res.render("projects/edit", {project: foundProject});
	});
});

// UPDATE ROUTE
router.put("/:id", function(req, res) {
	Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject){
		if(err){
			res.redirect("/projects");
		} else {
			res.redirect("/projects/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete("/:id", function(req, res){
	Project.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res,redirect("/projects");
		} else {
			res.redirect("/projects");
		}
	});
});

module.exports = router;