let mongoose=require("mongoose");
let express=require("express");
let router=express.Router({mergeParams:true});
let asyncWrap=require("../utils/asyncWrap.js");
let User=require("../models/user.js");
let passport=require("passport");
let flash=require("connect-flash");
let {saveRedirectUrl}=require("../middlewares/auth.js");
const { signupForm, signupPost, loginForm, loginPost, logout } = require("../controllers/user.js");


// get request for rendering the form
router.get("/signup",signupForm);

router.post("/signup",asyncWrap(signupPost));

/////////////////////////////////////////////
router.route("/login")
// get request for login form
.get(loginForm)
// post request for login form
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/users/login", failureFlash:true}),asyncWrap(loginPost));

/////////////////////////////////////////////

// logut route 
router.get("/logout",logout);
module.exports=router;