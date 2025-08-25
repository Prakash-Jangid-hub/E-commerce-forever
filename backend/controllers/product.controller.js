import { v2 as cloudinary } from "cloudinary"
import { Product } from "../models/product.model.js"

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestSeller, sizes } = req.body;

        if (!name || !description || !price || !category || !subCategory || !bestSeller) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!req.files && req.files.length === 0) {
            return res.status(400).json({ message: "Image file required" })
        }


        const allowedFormats = ["image/png", "image/jpeg", "image/jpg"]
        const isAllImagesValid = req.files.every(file => allowedFormats.includes(file.mimetype))

        if (!isAllImagesValid) {
            return res.status(400).json({ message: "Only PNG, JPEG, and JPG formats are allowed" })
        }

        let imageUrl = await Promise.all(
            req.files.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now(),
            bestSeller
        }

        const product = new Product(productData)

        await product.save()

        console.log(product)
        return res.status(200).json({ message: "Product added successfully", product })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Error in adding product " })
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        if (!products) {
            return res.status(400).json({ message: "Products are not available" })
        }

        return res.status(200).json({ message: "Products fetched successfully", products })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Error in fetching the products" })
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }

        return res.status(200).json({ message: "Product deleted successfully" })


    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Error in deleting the products" })
    }
}

const singleProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }

        return res.status(200).json({ message: "Product fetched successfully", product })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Error in fetching the products" })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct }
