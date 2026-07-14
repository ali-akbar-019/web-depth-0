const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // these options are for better performance
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
        // 
        mongoose.connection.on("error", (err)=>{
            console.log("Mongo Db connection error: ", err)

        })
        mongoose.connection.on("disconnected", ()=>{
            console.warn("MongoDB disconnected!")

        })
        // currently running application - process
        // SINGINT - signal interrupt
        process.on("SIGINT",async()=>{
            await mongoose.connection.close()
            console.log(`MongoDB connection closed`)
            // Program successfully band hua (koi error nahi).
            process.exit(0)
        })
    } catch (error) {
        console.log("MongoDB connection failed: ", error)
        // error se exit huwa
        process.exit(1)
    }
}

module.exports = connectDB