//all middleware goes here

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.redirect("/login");
}

module.exports = middlewareObj