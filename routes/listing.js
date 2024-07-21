let express=require("express");
let router=express.Router({mergeParams:true});
let asyncWrap=require("../utils/asyncWrap.js");
let {listingSchema}=require("../schema.js");
let customError=require("../utils/CustomError.js");
let Listing=require("../models/listing.js");
let Review=require("../models/review.js");
let cookieParser=require("cookie-parser");
let session=require("express-session");
var flash = require('connect-flash');
let passport=require("passport");
let {isLoggedIn, isOwner, validateListing}=require("../middlewares/auth.js");
const { allListing, newListingForm, newListingPost, destroyListing, specificListing, updateListingPatch, updateListingForm } = require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({storage:storage});
// let path=require("path");



// listing route 
router.route("/")
// all listing display
.get(asyncWrap(allListing))  
// post new listing
.post(isLoggedIn,upload.single("image"),asyncWrap(newListingPost));
// .post(isLoggedIn,validateListing,asyncWrap(newListingPost));


// new listing route
router.get("/new",isLoggedIn,newListingForm);

// update form  route 
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(updateListingForm));

// specific listing requests
router.route("/:id")
// delete route    
.delete(isLoggedIn,isOwner,asyncWrap(destroyListing))
// specific listing route
.get(asyncWrap(specificListing))
// edit listing request
.patch(isLoggedIn,isOwner,upload.single("image"),asyncWrap(updateListingPatch));



module.exports=router;
