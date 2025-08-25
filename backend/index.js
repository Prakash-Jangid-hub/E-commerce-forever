import express from "express"
import cors from "cors"
import "dotenv/config"
import app from "./app.js"
import connectDB from "./config/mongoDB.js"
import connectCloudinary from "./config/cloudinary.js"

//App Config

const PORT = process.env.PORT || 8000


app.use(express.json());


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("App is running on PORT", PORT)
    })
})
connectCloudinary()




