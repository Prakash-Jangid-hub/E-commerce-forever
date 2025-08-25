import { User } from "../models/user.model.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({success: false, message: "User is not registered" })
        }

        const verifyPassword = await bcrypt.compare(password, user.password)

        if (!verifyPassword) {
            return res.status(400).json({success: false, message: "Incorrect password" })
        }

        const token = await jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_USER_PASSWORD,
        )

        return res.status(200).json({success: true, message: "User logged in successfully", user, token })
    } catch (error) {
        console.log("Login error", error)
        return res.status(400).json({success: false, message: "Error in loggin user" })
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            password: hashPassword,
            email
        });

        await newUser.save();


        const token = await jwt.sign(
            {
                id: newUser._id
            },
            process.env.JWT_USER_PASSWORD,
        )

        return res.status(200).json({ success: true, message: "user registered", newUser, token });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "error in registering the user", error });
    }

};

export const logoutUser = async (req, res) => {
};

export const adminSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.json({ success: false, message: "Admin already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            name,
            password: hashPassword,
            email,
            role: "admin"
        });

        await newAdmin.save();


        const token = await jwt.sign(
            {
                id: newAdmin._id
            },
            process.env.JWT_USER_PASSWORD,
        )

        return res.status(200).json({ message: "admin registered", newAdmin, token });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: "error in registering the admin", error });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const admin = await User.findOne({ email })

        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin is not registered" });
        }

        const verifyPassword = await bcrypt.compare(password, admin.password)

        if (!verifyPassword) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        if (admin.role !== "admin") {
            return res.status(400).json({ success: false, message: "Admin not exist" });
        }

        const token = await jwt.sign(
            {
                id: admin._id
            },
            process.env.JWT_USER_PASSWORD,
            {
                expiresIn: "1d"
            }
        )

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.cookie("jwt", token, cookieOptions);

        return res.status(200).json({ message: "Admin logged in successfully", token })
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: "error in logging the admin", error });
    }
};

export const verifyAdmin = async (req, res) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            console.log("No token provided")
            return res.status(400).json({ messsage: "No token provided" })
        }

        const token = authHeader.split(" ")[1]

        const decoded = await jwt.verify(token, process.env.JWT_USER_PASSWORD)

        const admin = await User.findById(decoded.id)
        console.log(req.adminId)
        return res.status(200).json({ message: "admin verified", admin })


    } catch (error) {
        return res.status(400).json({ message: "Error in verifying the admin" })
    }
};
