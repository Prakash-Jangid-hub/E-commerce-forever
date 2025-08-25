import mongoose from "mongoose";
import dotenv from "dotenv"

const MONGO_DB = process.env.MONGO_DB

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_DB)

        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error in connecting to Database")
    }
}

export default connectDB