var Project = require("../models/project");
var Comment = require("../models/comment");

//all middleware goes here

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.redirectTo = req.originalUrl;
	req.flash("error", "Please login first!");
	res.redirect("/login");
}

middlewareObj.checkProjectOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Project.findById(req.params.id, function(err, foundProject){
			if(err || !foundProject){
				req.flash("error", "Project not found");
				res.redirect("back");
			} else {
				// does user own the project?
				if(foundProject.author.id.equals(req.user._id)){
					next();
					// otherwise redirect:
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	// if not, redirect:
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				// otherwise, redirect:
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	// if not, redirect:
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj