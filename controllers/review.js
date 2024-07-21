const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfuly");
    res.redirect(`/listings/${id}`);

}

module.exports.postReview=async(req,res)=>{
    let {id}=req.params;
    console.log(req.body);
    console.log("fddfddf",req.user._id);
    console.log(req.body.review);
    let review= new Review(req.body.review);
    review.author=req.user._id;
    let listing= await Listing.findOne({_id:id});
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success","review add sucessfully");
    console.log("review add sucessfully");
    res.redirect(`/listings/${id}`);
}