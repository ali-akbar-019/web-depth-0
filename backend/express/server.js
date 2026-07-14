const express = require("express")
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db');


const app = express();
// middle ware
app.use(express.json())
app.use(express.urlencoded({extended: true}))



// 
const PORT = process.env.PORT || 3000

// uncaught exception handle karo
process.on("uncaughtException", (err)=>{
    console.error("UNCAUGHT EXCEPTION! shutting down....")
    console.error(err.name, err.message)
    process.exit(1)

})

// 
connectDB();
// start the server

const server = app.listen(PORT, (req, res)=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)

})

// unhandled  rejection handle karo
process.on("unhandledRejection", (err)=>{
    console.error("UNHANDLED REJECTION! Shutting down..")
    console.error(err.name, err.message)
    server.close(()=>{
        process.exit(1)
    });
})
