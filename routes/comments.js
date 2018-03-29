var express = require("express");
var router = express.Router({mergeParams: true}); //merges params from project and comments together to access :id inside of comments
var Project = require("../models/project");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New

router.get("/new", function(req, res){
	// find project by id
	Project.findById(req.params.id, function(err, project){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {project: project});
		}
	});
});

// Comments Create
router.post("/", function(req, res){
	// Lookup project using id
	Project.findById(req.params.id, function(err, project){
		if(err){
			console.log(err);
			res.redirect("/projects");
		} else {
			// Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					// add username and id to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save()
					// connect new comment to the project
					project.comments.push(comment);
					project.save();
					// redirect campground showpage
					res.redirect("/projects/" + project._id);
				}
			})
		}
	});
});

// Comments Edit
router.get("/:comment_id/edit", function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		if(err){
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			} else {
				res.render("comments/edit", {project_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// Comments Update
router.put("/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/projects/" + req.params.id);
		}
	});
});

// Comments Delete
router.delete("/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/projects/" + req.params.id);
		}
	});
});


module.exports = router;