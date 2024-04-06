const User = require("../models/user.js");

module.exports.signupPage = async (req, res, next) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try{
        let {username, email, password} = req.body;

        let newUser = new User({username: username, email: email});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to WanderLust!!");
            res.redirect("/listing");
        });        
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginPage = async (req, res, next) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res, next) => {
    req.flash("success", "Welcome back to WanderLust!");
    let url = "/listing";
    if(res.locals.redirectUrl){
        url = res.locals.redirectUrl;
    }
    res.redirect(url);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next();
        }
        req.flash("success", "User logged out successfully!");
        res.redirect("/listing");
    })
}