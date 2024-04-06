const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();    
    await listing.save();

    req.flash("success", "Review created successfully!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req, res, next) => {
    let {id, reviewId} = req.params;
    
    let review = await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    
    if(!review){
        req.flash("error", "The requested review does not exists!");
        res.redirect(`/listing/${id}`);
    }else {
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listing/${id}`);
    }    
}