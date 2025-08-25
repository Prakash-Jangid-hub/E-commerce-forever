import { User } from "../models/user.model.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size } = req.body;

        if (!itemId || !size) {
            return res.status(400).json({ success: false, message: "Itemid and size required" })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const existItem = user.cartData.find((item) => item.itemId === itemId && item.size === size);

        if (existItem) {
            existItem.quantity += 1
        }
        else {
            user.cartData.push({ itemId, size, quantity: 1 });
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Added To Cart",
            cart: user.cartData
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Failed to add product in cart"
        });
    }
};

const updateCart = async (req, res) => {

    try {
        const userId = req.userId;
        const { itemId, size, quantity } = req.body;

        const user = await User.findById(userId);
        let cartData = user.cartData

        const existItem = cartData.find((item) => item.itemId === itemId && item.size === size)

        if (existItem) {
            existItem.quantity = quantity
        }

        await user.save()

        return res.status(200).json({ success: true, message: "Cart updated" })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "Failed to update the cart" })
    }

};

const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
        let cartData = user.cartData;

        return res.status(200).json({ success: true, cartData })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "Failed to get cart data" })
    }
};

const removeProduct = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.userId

        if (!itemId || !size) {
            return res.status(400).json({ success: false, message: "Itemid and size required" })
        }


        if (!userId) {
            return res.status(400).json({ success: false, message: "User is not authorized" })
        }

        const user = await User.findById(userId)
        let cartData = user.cartData

        const index = cartData.findIndex((item) => item.itemId.toString() === itemId.toString() && item.size === size)

        if (index > -1) {
            cartData.splice(index, 1)
            user.cartData = cartData
            await user.save()
        }
        else {
            return res.status(400).json({ success: false, message: "Product not found in cart" })
        }


        return res.status(200).json({ success: true, message: "Product removed", cart: user.cartData })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "Failed to remove product" })
    }
};

export { addToCart, updateCart, getUserCart, removeProduct }