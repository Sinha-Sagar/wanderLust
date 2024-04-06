const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlist");
}

main()
    .then(() => {console.log("Connected to database...")})
    .catch((err) => {console.log(err)});

async function data() {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "660be58e38e4e68584391de3"}));
    await Listing.insertMany(initdata.data);
    console.log("Data Initialised");
};

data();