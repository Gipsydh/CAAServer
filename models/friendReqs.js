import mongoose from "mongoose";
const firendReqSchema=new mongoose.Schema({
 from:{
  type:String,
  required:[true,"cannot be empty"]
 },
 to:{
  type:String,
  required:[true,"cannot be empty"]
 },
 date:{
  type:String
 },
 key:{
  type:String,
  required:[true,"yess"]
 }
})

export default mongoose.model('friendReqs',firendReqSchema)