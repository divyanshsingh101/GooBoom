const Listing = require("../models/listing");
const Review = require("../models/review");
const { listingSchema, reviewSchema } = require("../schema");
const customError = require("../utils/CustomError");

module.exports.isLoggedIn=(req,res,next)=>{
   
    if(!req.isAuthenticated()){
      // console.log("at islogged in ",req);
        req.session.redirectUrl=req.originalUrl; // if not auth then save the url user trying to accesss
        req.flash("error","login to first ");
         res.redirect("/users/login");
    }
    else {
      // console.log("at islogged in ",req.body);
        next();
    }
} // this middleware checks if the session cookie if the user is authentic and req has those cookies 


module.exports.saveRedirectUrl=(req,res,next)=>{
  console.log("at saveredirect in ",req.body);
    if(req.session.redirectUrl){
    res.locals.redirect=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!res.locals.curUser || !res.locals.curUser._id.equals(listing.owner._id)){
      req.flash("error","you are not the owner of the listing");
      res.redirect(`/listings/${id}`);
  }
  else {
    next();
  }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    res.locals.isAuthor=false;
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.curUser || !res.locals.curUser._id.equals(review.author._id)){
        req.flash("error","you are not the author of the review");
        res.redirect(`/listings/${id}`);
    }
    else {
        res.locals.isAuthor=true;
      next();
    }
  };


  module.exports.validateListing=(req,res,next)=>{
    console.log("hhhhh",req.body);
 let {error}=listingSchema.validate(req.body);
 if(error){
    throw new customError(400,error.message);
 }
 else {
    next();
 }
};

module.exports.validateReview=(req,res,next)=>{
  console.log(req.body);
  let {error}=reviewSchema.validate(req.body);
  console.log(error);
  if(error){
     throw new customError(400,error);
  }
  else {
     next();
  }
 }

 