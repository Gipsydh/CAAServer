import mongoose from "mongoose";

const friendesSchema=new mongoose.Schema({
 for:{
  type:String,
  required:[true, "for cannot be empty"]
 },
 haveFrnds:{
  type:Array
 }
})

export default mongoose.model('friends',friendesSchema)