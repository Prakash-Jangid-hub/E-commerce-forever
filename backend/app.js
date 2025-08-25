// app.js
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

const app = express();

app.use(express.json());

const allowOrigins = [process.env.ADMIN_FRONTEND_URL, process.env.USER_FRONTEND_URL]

app.use(cors({
    origin: allowOrigins,
    credentials: true,
    methods: ["PUT", "GET", "DELETE", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

export default app;
