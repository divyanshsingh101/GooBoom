let mongoose=require("mongoose");
let Review=require("./review");
let User=require("./user");
let listingSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
           url:String,
           filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    coordinates:{
        lat:Number,
        lng:Number,
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{  // these are the middlewares that are called pre -before the request is executed and post- after 

   if(listing.reviews.length){
    await Review.deleteMany({_id:{$in:listing.reviews}});
   }
    
});
let Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;