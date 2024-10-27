const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenVerified) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Attach user data (userId, role) to req.user
    req.user = {
      userId: tokenVerified.userId,
      role: tokenVerified.role
    };

    next(); // Pass the request to the next middleware or controller

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  authUser
};