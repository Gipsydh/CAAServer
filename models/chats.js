import mongoose from 'mongoose'

const chatsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'text cannot be empty'],
  },
  sender: {
    type: String,
    required: [true, 'sender cannot be empty'],
  },
  receiver: {
    type: String,
    required: [true, 'receiver cannot be empty'],
  },
  time: {
    type: Date,
    required: [true, 'time cannot be empty'],
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
  content: {
    type:String,
  },
  chatRoomID: {
    type: String,
    required: [true, 'required'],
  },
  chatHolders: {
    type: Array,
  },
})
export default mongoose.model('chats', chatsSchema)
