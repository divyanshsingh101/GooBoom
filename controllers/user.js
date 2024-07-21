let User=require("../models/user.js");


module.exports.signupForm=(req,res)=>{
    res.render("./user/signup.ejs");
  }

module.exports.signupPost=async(req,res)=>{
    try{
  console.log(req.body);
  let {user,password}=req.body;
  let registeredUser=await User.register(user,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
      next(err);
    }
    req.flash("success","welcome to GooBoom!");
    res.redirect("/listings");
  })
//   req.flash("success","welcome to GooBoom!");
//  res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/users/signup");
    }
}


module.exports.loginForm=(req,res)=>{
    res.render("./user/login.ejs");
}


module.exports.loginPost=async(req,res)=>{
    console.log("authentication done ");
   //  console.log(res.locals.redirect);
   //  console.log(req.originalUrl);
    req.flash("success","welcome back to GooBoom!");
    let redirect=res.locals.redirect;
    if(!redirect){
     res.redirect("/listings");
    }
    else{
    res.redirect(`${redirect}`);
    }
   }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","you are logged out !");
      res.redirect("/listings");
    });
  }   