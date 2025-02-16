const { refreshAccessToken } = require("../utils/token");

// Refresh Access Token
exports.getRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized, please login again" });
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken, res);
    return res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
