import mongoose from "mongoose"


const usersSchema=new mongoose.Schema({
  email:{
   type:String,
   required:[true,"email cannot be empty"]
  },
  fullName:{
   type:String,
   required:[true,"fullName cannot be empty"]
  },
  firstName:{
   type:String,
   required:[true,"first name cannot be empty"]
  },
  picture:{
   type:String
  }

})
export default mongoose.model('users',usersSchema)