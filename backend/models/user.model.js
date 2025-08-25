import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            size: { type: String },
            quantity: { type: Number, default: 1 }
        }
    ],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { minimize: false })

export const User = mongoose.model("user", userSchema)