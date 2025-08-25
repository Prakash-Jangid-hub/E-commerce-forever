import express from "express"
import { allOrders, placeOrder, placeOrderRazorPay, placeOrderStripe, updateStatus, userOrders, verifyRazorpay, verifyStripe } from "../controllers/order.controller.js"
import {adminMiddleware} from "../middleware/admin.auth.js"
import { userMiddleware } from "../middleware/user.auth.js"

const orderRouter = express.Router()

orderRouter.get("/allorders", adminMiddleware, allOrders)
orderRouter.put("/status", adminMiddleware, updateStatus)


orderRouter.post("/placeorder", userMiddleware, placeOrder)
orderRouter.post("/stripe", userMiddleware, placeOrderStripe)
orderRouter.post("/razorpay", userMiddleware, placeOrderRazorPay)

orderRouter.get("/userorders", userMiddleware, userOrders)

orderRouter.post('/verifystripe',userMiddleware, verifyStripe)
orderRouter.post('/verifyrazorpay',userMiddleware, verifyRazorpay)

export default orderRouter;