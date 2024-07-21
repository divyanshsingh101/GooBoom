let Listing=require("C:/Users/divya/Desktop/GooBoom/models/listing.js")
let adata=require("./data.js");
let mongoose=require("mongoose");
// console.log(data);


let mongoDB_url="mongodb://localhost:27017/GooBoom";
async function main(){
    await mongoose.connect(mongoDB_url);
};

main() // return a promise 
.then(()=>{console.log("connection successful")})
.catch((err)=>console.log(err));

// console.log(data.data);
 let fun=async()=>{
    await Listing.deleteMany({});
    
    adata.data=adata.data.map((obj)=>({...obj,owner:'6691822ab052a68c785cd279'}));
    await Listing.insertMany(adata.data);
};

fun();