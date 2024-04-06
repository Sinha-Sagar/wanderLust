const express = require("express");
const router = express.Router();
const ExpressError = require("../utilits/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const asyncWrap = require("../utilits/asyncWrap.js");
const {isLoggedIn,isOwner} = require("../isLoggedIn.js");

const {storage} = require("../cloudCofig.js");
const multer = require("multer");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

//Listing Route
router.get("/", asyncWrap(listingController.index));

//Add page route
router.get("/new", isLoggedIn, asyncWrap(listingController.renderNewForm));

//Show route
router.get("/:id", asyncWrap(listingController.showListing));

//Add new list route 
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, asyncWrap(listingController.addNewListing));

//Edit page route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.editForm));

//Edit listing route
router.patch("/:id", isOwner, upload.single("listing[image]"), validateListing, asyncWrap(listingController.editListing));

//Delete listing route
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));

module.exports = router;