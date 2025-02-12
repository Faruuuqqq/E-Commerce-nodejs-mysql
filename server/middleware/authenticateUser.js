const { verifyToken } = require("../utils/token");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Missing token." });
        }

        const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer "
        const decoded = await verifyToken(token);

        req.user = decoded; // store user data in request, to use at controller
        next(); // continue to next handler
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
    }
};
