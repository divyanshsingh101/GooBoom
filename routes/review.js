let express=require("express");
let router=express.Router({mergeParams:true});
let asyncWrap=require("../utils/asyncWrap.js");
let {reviewSchema}=require("../schema.js");
let customError=require("../utils/CustomError.js");
let Listing=require("../models/listing.js");
let Review=require("../models/review.js");
var flash = require('connect-flash');
let {isLoggedIn, isOwner, isReviewAuthor, validateReview}=require("../middlewares/auth.js"); 
const { deleteReview, postReview } = require("../controllers/review.js");



router.post("/",isLoggedIn,validateReview,asyncWrap(postReview));

// delete review get request
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(deleteReview));


module.exports=router;