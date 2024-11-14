const jwt = require('jsonwebtoken');

// const authUser = (req, res, next) => {
//   try {
//     const  token  = req.cookies.token;


//     if (!token) {
//       return res.status(401).json({ success: false, message: " not authenticated" });
//     }

//     const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

//     if (!tokenVerified) {
//       return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     // Attach user data (userId, role) to req.user
//     req.user = {
//       userId: tokenVerified.userId,
//       role: tokenVerified.role
//     };

//     next(); // Pass the request to the next middleware or controller

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

const authUser = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ success: false, message: "User not authenticated, token missing" });
    }

    // Verify the JWT token
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenVerified) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Attach user data (userId, role) to req.user
    req.user = {
      userId: tokenVerified.userId,
      role: tokenVerified.role,
    };

    next(); // Pass the request to the next middleware or controller

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token has expired" });
    } else {
      console.log(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

module.exports = {
  authUser
};