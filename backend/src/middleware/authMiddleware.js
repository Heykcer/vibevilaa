import { adminAuth } from '../config/firebaseAdmin.js';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Find the user in our database based on the firebase email
    const user = await User.findOne({ email: decodedToken.email });
    
    if (!user) {
      res.status(401);
      return next(new Error('User not found in the database'));
    }

    // Attach user to request object
    req.user = user;
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

