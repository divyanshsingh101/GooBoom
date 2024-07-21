let mongoose =require("mongoose");
let schema=mongoose.schema;

let reviewSchema=mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    comment:String,
    created_at:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

}
})

let Review=mongoose.model("Review",reviewSchema);

module.exports=Review;