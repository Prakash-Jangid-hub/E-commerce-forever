import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    quantity:{
        type: Number,
        required: true,
    },
    size:{
        type: String,
        required: true
    }
}, {_id: false})


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Order Placed"
    },
    paymentMethod: {
        type: String,
        required: true
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Number,
        required: true
    }
})

export const Order = mongoose.model("order", orderSchema)