const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log("Token from cookie:", req.cookies.accessToken);

    if (!token) {
      res.locals.user = null;
      return next(); // Lanjut tanpa user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS_TOKEN);
    res.locals.user = decoded; // Untuk EJS
    req.user = decoded;        // Untuk backend
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.locals.user = null;
    next(); // Tetap lanjut meskipun token error
  }
};
