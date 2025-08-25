import express from "express"
import { addToCart, getUserCart, removeProduct, updateCart } from "../controllers/cart.controller.js"
import { userMiddleware } from "../middleware/user.auth.js"

const cartRouter = express.Router()

cartRouter.post("/addtocart", userMiddleware, addToCart)
cartRouter.post("/updatecart", userMiddleware, updateCart)
cartRouter.get("/getusercart", userMiddleware, getUserCart)
cartRouter.put("/removeproduct", userMiddleware, removeProduct)

export default cartRouter;