const { verifyAccessToken } = require("../utils/token");
const cookieParser = require("cookie-parser");

module.exports = async (req, res, next) => {
  try {
    let token;

    // Ambil token dari Authorization header atau cookies
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Cookies:", req.cookies);
    console.log("🔹 Token dari Authorization Header:", req.headers.authorization);
    console.log("🔹 Token dari Cookies:", req.cookies?.token);
    console.log("🔹 Token yang diterima di middleware:", token);

    if (!token) {
      console.log("⚠️ Token tidak ditemukan.");
      return res.status(401).json({ error: "Unauthorized: Missing token." });
    }

    // Verifikasi token
    const decoded = await verifyAccessToken(token);
    req.user = decoded; // Simpan data user di request
    next(); // Lanjut ke handler berikutnya
  } catch (error) {
    console.log("❌ Token tidak valid atau expired.");
    console.error("Error in authentication:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
  }
};
