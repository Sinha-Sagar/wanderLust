const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "User must be logged in to perform this operation!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(res.locals.user && res.locals.user._id.equals(listing.owner._id))){
        req.flash("error", "You are not the owner of this list");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => { 
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.user && res.locals.user._id.equals(review.author._id))){
        req.flash("error", "You are not the owner of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}