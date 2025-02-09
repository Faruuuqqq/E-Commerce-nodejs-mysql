// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
//const userToken = require("./routes/userTokenRoute")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // parse application/json
// app.use(express.static('public')); // to serve static file like CSS
app.use(express.static(path.join(__dirname, "public")));
// Connect to the database

// Mount routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
//app.use("/api/token", userToken)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
