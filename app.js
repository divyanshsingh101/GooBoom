let mongoose=require("mongoose");
let express=require("express");
let Listing=require("./models/listing.js");
let Review=require("./models/review.js");
let path=require("path");
var methodOverride = require('method-override');
let ejsMate=require("ejs-mate"); 
let asyncWrap=require("./utils/asyncWrap.js");// catching error in async functions
let customError=require("./utils/CustomError.js");
const joi = require("joi");
let {listingSchema,reviewSchema}=require("./schema.js");  // server site validation 
let listingRoute=require("./routes/listing.js"); // importing router 
let reviewRoute=require("./routes/review.js");   // importing router 
let userRoute=require("./routes/user.js");
let cookieParser=require("cookie-parser");
let session=require("express-session");
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');
let passport=require("passport");
let LocalStrategy=require("passport-local");
let User=require("./models/user.js");
const { root } = require("./controllers/listing.js");


require('dotenv').config();
// console.log(process.env)

////////mongodb setup ////////////////////
let mongoDB_url="mongodb://localhost:27017/GooBoom";
let atlas_url=process.env.ATLAS_URL;
async function main(){
    await mongoose.connect(atlas_url);
};

main() // return a promise 
.then(()=>{console.log("database connected ")})
.catch((err)=>console.log(err));
/////////////////////////////////////////

let app=express();
let store=MongoStore.create({
      mongoUrl:atlas_url,
      crypto:{
        secret:process.env.SECRET,

      },
      touchAfter:24*3600,
    });
store.on("error",()=>{
    console.log("error in the session store ",err);
});

let sessionVar={
    store,
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    
};
app.use(cookieParser());
app.use(session(sessionVar));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user); // Passes the user object to serializeUser
    } catch (err) {
        done(err, null); // Passes the error to serializeUser
    }
});
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.curUser=req.user;
   /// for checking the flow of control /////////->info static files are called after the route is callled 
    if(res.locals.curUser){
   console.log(res.locals.curUser._id);
    }
   console.log(req.originalUrl);
    next();
});
passport.use(new LocalStrategy(User.authenticate())); // for local authentication statergy
app.use(express.urlencoded({extended:true}));  // for taking out the info from req.body
app.set("view engine","ejs");// setting up the view engine for ejs 
app.set("views",path.join(__dirname,"views")); // defining for render
app.use(methodOverride('_method')); // accepting other then post and get request from html form
app.use(express.static(path.join(__dirname,"public")));// static file 
app.engine("ejs",ejsMate); // layout like nav and footer 
let port=3000;
app.listen(port,()=>{
    console.log("app is listening");
});
///////////routes//////////////////////////////
app.use("/listings",listingRoute);// routes 
app.use("/listings/:id/reviews",reviewRoute); //routes
app.use("/users",userRoute); // route 

// root route 
app.get("/",root);

// test route for user
app.get("/demouser",async(req,res)=>{
    let demoUser={
        email:"abc@gmail.com",
        username:"adolf hitler",

    }

   let registeredUser= await  User.register(demoUser,"password");
   res.send(registeredUser);
})



app.all("*",(req,res,next)=>{
    next(new customError(404,"page not found !"));
});

app.use((err,req,res,next)=>{
    // res.status(statusCode).send(err.message);
    let {statusCode=500,message="something went wrong!"}=err;
    console.log(err);
    // console.log(err);
  res.status(statusCode).render("./listing/error.ejs",{message});
    // res.status(statusCode).send(message);
});




// backup
// // listing route 
// app.get("/listings",asyncWrap(async(req,res)=>{
//     let allListing=await Listing.find({});
//     res.render("./listing/index.ejs",{allListing});
// }));
// // new listing route
// app.get("/listings/new",(req,res)=>{
//     res.render("./listing/new.ejs");
//     console.log("new listing working");
// });
// // post route
// app.post("/listings",validateListing,asyncWrap(async(req,res,next)=>{

//     let {title,description,location,price,country,image}=req.body;
//     let newListing= new Listing({
//         title:title,
//         description:description,
//         location:location,
//         price:price,
//         country:country,
//         image:image,
    
//     });
//     // console.log(newListing);
//    await newListing.save().then(()=>{console.log("saved")});

  
//    res.redirect("/listings");
   
// }));

// // validation error handling middleWARE FOR (server site validation error)
// // app.use((err,req,res,next)=>{
// //     res.send("something went wrong !!");
// // });
// // delete route    
// app.delete("/listings/:id",asyncWrap(async(req,res)=>{
//     let {id}=req.params;
//     console.log(id);
//     let listing= await Listing.findOneAndDelete({_id:id});
//     // console.log(listing.reviews);
    
//     console.log("deleted a listing");
//     res.redirect("/listings");
// }));

// // specific listing route
// app.get("/listings/:id",asyncWrap(async(req,res)=>{
//     let {id}=req.params;
//     let listing= await Listing.find({_id:id}).populate("reviews");
//     console.log(listing[0]);
//     // console.log(id);
//     res.render("./listing/show.ejs",{listing});
// }));

// // update route 
// app.get("/listings/:id/edit",asyncWrap(async(req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.find({_id:id});
//     console.log(listing);
//     res.render("./listing/edit.ejs",{listing});
// }));

// app.patch("/listings/:id",validateListing,asyncWrap(async(req,res)=>{
//     console.log(req.body);
//     let {id}=req.params;
//     console.log(req.body);
//     let {title,description,price,location,country,image}=req.body;
//     let updated=await Listing.findByIdAndUpdate(id ,{title:title,description:description,price:price,country:country,location:location,image:image})
//      console.log("update done");
//      console.log(updated);
//         res.redirect("/listings");

  
    
// }));

// // review POST REQUEST
// app.post("/listings/:id/reviews",validateReview,asyncWrap(async(req,res)=>{
//     let {id}=req.params;
//     console.log(req.body);
//     console.log(req.body.review);
//     let review= new Review(req.body.review);

//     let listing= await Listing.findOne({_id:id});
//     listing.reviews.push(review);
//     await listing.save();
//     await review.save();
//     console.log("review add sucessfully");
//     res.redirect(`/listings/${id}`);
// }));

// // delete review get request
// app.delete("/listings/:id/reviews/:reviewId",asyncWrap(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     console.log(id,reviewId);
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);

// }));






