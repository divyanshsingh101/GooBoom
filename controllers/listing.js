const Listing = require("../models/listing");

module.exports.root=(req,res)=>{
    console.log("request successful");
    res.send("hey i am root!!");
};

module.exports.allListing=async(req,res)=>{
    
    let allListing=await Listing.find({});
    res.render("./listing/index.ejs",{allListing});
}

module.exports.newListingForm=(req,res)=>{
    
    res.render("./listing/new.ejs");
    console.log("new listing working");
}

module.exports.newListingPost=async(req,res,next)=>{
  try{
    let {title,description,location,price,country}=req.body;
    let {path:url,filename}=req.file;
    console.log(url,filename);
    let newListing= new Listing({
        title:title,
        description:description,
        location:location,
        price:price,
        country:country,
        image:{url,filename},
    
    });
    newListing.owner=req.user._id;
    let add=location+","+country;
    console.log(add);
    
        const opencage = require('opencage-api-client');

        // note that the library takes care of URI encoding
        let data = await opencage.geocode({ q:add });
       
            // console.log(JSON.stringify(data));
            if (data.status.code === 200 && data.results.length > 0) {
              const place = data.results[0];
              console.log(place.formatted);
              console.log(place.geometry);
              console.log(place.annotations.timezone.name);
             
              // console.log(id);
              let coord=place.geometry;
              console.log(coord.lat);
              newListing.coordinates=coord;
              // console.log(newListing);
              await newListing.save().then(()=>{console.log("saved")});
              req.flash("success","listing created successfully");
           //    console.log(res.locals.flashMessage);
              res.redirect("/listings");
            } else {
              console.log('Status', data.status.message);
              console.log('total_results', data.total_results);
            }
          
        }catch(error) {
            // console.log(JSON.stringify(error));
            console.log('Error', error.message);
            // other possible response codes:
            // https://opencagedata.com/api#codes
            if (error.status.code === 402) {
              console.log('hit free trial daily limit');
              console.log('become a customer: https://opencagedata.com/pricing');
            }
          };
        
        // ... prints
        // Theresienhöhe 11, 80339 Munich, Germany
        // { lat: 48.1341651, lng: 11.5464794 }
        // Europe/Berlin
    // console.log(req.user);
  
   
}


module.exports.destroyListing=async(req,res)=>{
    
    let {id}=req.params;
    console.log(id);
    let listing= await Listing.findOneAndDelete({_id:id});
    req.flash("success","listing deleted successfuly");
    // console.log(listing.reviews);
    console.log("deleted a listing");
    res.redirect("/listings");
}

module.exports.specificListing=async(req,res)=>{
   
    let {id}=req.params;
    let listing= await Listing.find({_id:id}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");

    if(!listing[0]){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    
  
        res.render("./listing/show.ejs",{listing});
 
}

module.exports.updateListingForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.find({_id:id});
    console.log(listing[0].image.url);
    let convImg=listing[0].image.url;
    convImg=convImg.replace("/upload","/upload/w_200");
    console.log(convImg);
    if(!listing){
        req.flash("error","listing does not exist ");
        res.redirect("/listings");
    }
    res.render("./listing/edit.ejs",{listing,convImg});
}

module.exports.updateListingPatch=async(req,res)=>{
    try{
    console.log(req.body);
    let {id}=req.params;
   
    console.log(req.body);
    let {title,description,price,location,country}=req.body;
    
    let updated=await Listing.findByIdAndUpdate(id ,{title:title,description:description,price:price,country:country,location:location});
    
    if(typeof req.file!=="undefined"){   
        console.log(req.file);
        let {path:url,filename}=req.file;
        
       updated.image={url,filename};
        await updated.save();

    }
    
    let add=updated.location+","+updated.country;
    console.log(add);
    
        const opencage = require('opencage-api-client');

        // note that the library takes care of URI encoding
        let data = await opencage.geocode({ q:add });
       
            // console.log(JSON.stringify(data));
            if (data.status.code === 200 && data.results.length > 0) {
              const place = data.results[0];
              console.log(place.formatted);
              console.log(place.geometry);
              console.log(place.annotations.timezone.name);
             
              // console.log(id);
              let coord=place.geometry;
              console.log(coord.lat);
              updated.coordinates=coord;
        
              await updated.save();
            
              req.flash("success","listing updated successfully");
              console.log("update done");
               console.log(updated);
            res.redirect(`/listings/${id}`);

            } else {
              console.log('Status', data.status.message);
              console.log('total_results', data.total_results);
            }
          
        }catch(error) {
            // console.log(JSON.stringify(error));
            console.log('Error', error.message);
            // other possible response codes:
            // https://opencagedata.com/api#codes
            if (error.status.code === 402) {
              console.log('hit free trial daily limit');
              console.log('become a customer: https://opencagedata.com/pricing');
            }
          };
        
        // ... prints
        // Theresienhöhe 11, 80339 Munich, Germany
        // { lat: 48.1341651, lng: 11.5464794 }
        // Europe/Berlin
    // console.log(req.user);
  
    

  
    
}