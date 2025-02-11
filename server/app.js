const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
//const userToken = require("./routes/userTokenRoute")
const homeRoutes = require("./routes/homeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // parse application
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Mount routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
//app.use("/api/token", userToken)
app.use("/", homeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
