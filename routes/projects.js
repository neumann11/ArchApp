var express = require("express");
var router	= express.Router();

// INDEX - show all architecture projects
router.get("/", function(req, res){
	res.render("projects/index");
});

module.exports = router;