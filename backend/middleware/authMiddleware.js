// authMiddleware.js:
//this verifies the token and attaches the decoded user information to the request object
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Extracted Token:", token);
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    // Verify token
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with an environment variable in production
    req.user = decoded; // Attach decoded user information to the request object
    console.log(req.user);
    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

module.exports = auth;
