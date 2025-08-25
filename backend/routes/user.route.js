import express from "express"
import { adminLogin, adminSignUp, loginUser, logoutUser, registerUser, verifyAdmin } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/logout", logoutUser)
userRouter.post("/adminlogin", adminLogin)
userRouter.post("/adminsignup", adminSignUp)
userRouter.get("/adminverify", verifyAdmin)

export default userRouter;