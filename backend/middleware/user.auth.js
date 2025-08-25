import jwt from "jsonwebtoken"

export const userMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(400).json({ message: "No token or Invalid format" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = await jwt.verify(token, process.env.JWT_USER_PASSWORD)
        req.userId = decoded.id
        next()
    } catch (error) {
        console.log("Invalid token or expired", error.message);
        return res.status(400).json({ errors: "Invalid token or expired" });
    }
}