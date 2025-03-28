const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userTokenRoutes = require("./routes/userTokenRoutes");
const homeRoutes = require("./routes/homeRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =================== MIDDLEWARES =================== //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// View Engine & Static Folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// =================== ROUTES =================== //
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/token", userTokenRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes);
app.use("/", homeRoutes);


// =================== START SERVER =================== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});