import express from "express"
import { addProduct, listProducts, removeProduct, singleProduct } from "../controllers/product.controller.js"
import { upload } from "../middleware/multer.js"
import { adminMiddleware } from "../middleware/admin.auth.js"

const productRouter = express.Router()

productRouter.post("/addproduct", adminMiddleware, upload.array("images"), addProduct)
productRouter.get("/listproducts", listProducts)
productRouter.delete("/removeproduct/:productId", adminMiddleware, removeProduct)
productRouter.get("/singleproduct/:productId", singleProduct)

export default productRouter