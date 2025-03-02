module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin === "admin") {
    next ();
  } else {
    res.status(403).send("Access denied. admins only");
  }
}