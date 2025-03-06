module.exports = (req, res, next) => {
  console.log("User Data:", req.user); // Cek apakah req.user ada
  if (req.user && req.user.isAdmin) {
      return next();
  } else {
      console.log("Access Denied: User is not an admin");
      return res.status(403).send("Access denied. Admins only.");
  }
};
