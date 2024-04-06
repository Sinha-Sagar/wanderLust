const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            require: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
});

listingSchema.post("findOneAndDelete", async (data) => {
    if(data){
        await Review.deleteMany({_id: {$in: data.review}})
    }
});

let Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;