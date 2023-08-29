const mongoose=require("mongoose")
const NotesSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
   title:{
    type:String,
    required:true
   },
   desc:{
    type:String,
    required:true
   },
   tag:{
    type:String,
    required:true
   },
   date:{
    type: Date,
    default: Date.now
},
})
const Notes=mongoose.model("Notes",NotesSchema)
module.exports=Notes