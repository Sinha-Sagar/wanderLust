const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    let lists = await Listing.find();
    res.render("listings/home.ejs", {lists});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    let result = await Listing.findById(id).populate({path: "review", populate: {path: "author"}}).populate("owner");
    if(!result){
        req.flash("error", "The requested listing does not exists!");
        res.redirect("/listing");
    }else {
        res.render("listings/show.ejs", {result});
    }
}

module.exports.addNewListing = async (req,res) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
    
    let newItem = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    if(!newItem){
        throw new ExpressError(404, "Send valid data for Listing!")
    }

    let newListing = new Listing(newItem);

    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;

    let item = await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listing");
}

module.exports.editForm = async (req, res) => {
    let {id} = req.params;
    let result = await Listing.findById(id);
    if(!result){
        req.flash("error", "The requested listing does not exists!");
        res.redirect("/listing");
    }else {
        let originalImage = result.image.url;
        originalImage = originalImage.replace("/upload", "/upload/h_300,w_300");
        res.render("listings/edit.ejs", {result, originalImage});
    }
}

module.exports.editListing = async (req, res) => {
    let coordinates = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send(); 

    console.log(coordinates.body.features[0].geometry);

    let {id} = req.params;
    let newItem = req.body.listing;
    // console.log(newItem);
    if(!newItem){
        throw new ExpressError(404, "Send valid data for Listing!")
    }
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newItem.image = {url, filename};
    }
    newItem.geometry = coordinates.body.features[0].geometry;
    let result = await Listing.findByIdAndUpdate(id, newItem, {new: true});
    console.log(result);
    req.flash("success", "Listing edited successfully!");
    res.redirect("/listing");
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let result = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listing");
}