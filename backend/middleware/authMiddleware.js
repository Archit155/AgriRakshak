const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Assuming format "Bearer <token>"
    const bearerToken = token.split(' ')[1] || token;
    
    // Hardcoded secret for demo purposes. In production, use env variable.
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'secret_krishi_key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
