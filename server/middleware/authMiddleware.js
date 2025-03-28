module.exports = (req, res, next) => {
  try {
      const token = req.cookies.token;
      if (!token) {
          res.locals.user = null;
          return next(); // Lanjut tanpa user
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded; // Untuk EJS
      req.user = decoded;        // Untuk logic backend
      next();
  } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      res.locals.user = null;
      next(); // Tetap lanjut meskipun error token
  }
};
