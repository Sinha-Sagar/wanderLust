const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utilits/asyncWrap.js");
const ExpressError = require("../utilits/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isAuthor} = require("../isLoggedIn.js");

const reviewController = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

//Add review route
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.addReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn, isAuthor, asyncWrap(reviewController.destroyReview));

module.exports = router;