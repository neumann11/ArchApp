var express = require("express");
var router	= express.Router();
var passport = require("passport");

// ROOT Router

router.get("/", function(req, res) {
	res.render("landing");
});

module.exports = router;