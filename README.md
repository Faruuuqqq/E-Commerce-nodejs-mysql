# E-Commerce Web Application

This project is a full-stack e-commerce web application built using **Node.js, MySQL, EJS, and Bootstrap**. It provides essential functionalities for an online store, including product browsing, a shopping cart, user authentication, and order management.

## Technologies Used

* **Frontend:** EJS (Embedded JavaScript), Bootstrap, HTML, CSS
* **Backend:** Node.js (Express.js)
* **Database:** MySQL
* **Authentication:** JWT (JSON Web Token)

## Features

* **Product Listing:** Users can browse products with details such as name, description, price, and images.
* **Shopping Cart:** Users can add, update, and remove items in their cart.
* **User Authentication:** Secure user authentication using JWT, allowing users to register, log in, and manage their accounts.
* **Order Management:** Users can place orders and view order history.
* **Admin Panel (Planned):** Admins can manage products, view orders, and manage users (future enhancement).

## Setup and Installation

### 1. Clone the repository
```bash
git clone <repository_url>
```

### 2. Navigate to the project directory
```bash
cd e-commerce-node-mysql
```

### 3. Backend Setup (Node.js)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure the database connection:**
   * Create a MySQL database.
   * Update the database credentials in the `.env` file:
   ```
   DB_HOST=your_host
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   JWT_SECRET_KEY_ACCESS_TOKEN=your_secret_key
   JWT_SECRET_KEY_REFRESH_TOKEN=your_secret_key
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```

### 4. Frontend Setup (EJS + Bootstrap)

Since we use EJS for templating, no separate frontend build process is required. Ensure that the server is running, then open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
e-commerce-node-mysql/
├── views/            # EJS templates
│   ├── pages/
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── cart.ejs
│   │   ├── orders.ejs
│   │   ├── product-details.ejs
│   │   ├── ...
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   ├── layouts.ejs
│   └── ...
├── public/           # Static files (CSS, JS, images)
│   ├── css/
│   │   ├── styles.css
│   ├── js/
│   │   ├── script.js
│   ├── images/
├── routes/           # Express routes
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
├── controllers/      # Controllers
│   ├── productController.js
│   ├── userController.js
│   ├── cartController.js
│   ├── orderController.js
├── models/          # Database models
│   ├── Product.js
│   ├── User.js
│   ├── Order.js
│   ├── Cart.js
├── middleware/       # Authentication and other middleware
│   ├── authenticateUser.js
├── config/
│   ├── db.js         # Database connection
├── app.js            # Main server file
├── package.json
├── .env              # Environment variables
└── README.md
```

## API Endpoints

| Endpoint             | Method | Description |
|----------------------|--------|-------------|
| `/`                  | GET    | Home page |
| `/products`          | GET    | Get all products |
| `/product/:id`       | GET    | Get product details |
| `/cart`              | GET    | View cart |
| `/cart/add/:id`      | POST   | Add product to cart |
| `/cart/remove/:id`   | DELETE | Remove product from cart |
| `/users/register`    | POST   | User registration |
| `/users/login`       | POST   | User login (JWT) |
| `/orders`            | GET    | View user orders |
| `/orders/place`      | POST   | Place an order |

## Future Enhancements
* **Admin Panel:** Product and order management.
* **Payment Integration:** Simulated checkout flow.
* **Product Search and Filtering.**

This project is actively being developed. Contributions and suggestions are welcome!

