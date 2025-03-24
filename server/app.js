const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userTokenRoutes = require("./routes/userTokenRoutes");
const homeRoutes = require("./routes/homeRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =================== MIDDLEWARES ===================
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(bodyParser.json()); // Body parser for JSON
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Auth middleware untuk menyimpan `user` di res.locals
app.use(authMiddleware);
// app.use(authorizeAdmin);

// Set view engine dan folder public
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// =================== ROUTES ===================
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/token", userTokenRoutes);
app.use("/", homeRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes);

// =================== START SERVER ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
