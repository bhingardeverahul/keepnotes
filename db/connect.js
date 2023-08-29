const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected sucessfully...!")
}).catch((err)=>{
    console.log(err)
})


// const mongoose=require("mongoose")
// require('dotenv').config()
// mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
//   })
// const db=mongoose.connection;
// db.on("error",(error)=>{
// console.log(error)
// })
// db.once("open",()=>{
//     console.log("MongoDB  connected successfully....")
// }) 