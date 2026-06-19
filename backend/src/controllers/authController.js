import { adminAuth } from '../config/firebaseAdmin.js';
import { User } from '../models/index.js';

export const loginUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('No token provided');
    }

    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { email, name, picture } = decodedToken;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: `firebase-auth-${Date.now()}`, // mock password since we use firebase auth
        achievements: ['First Login'],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balanceCoins: user.balanceCoins,
        balanceGems: user.balanceGems,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
};

// Kept for backwards compatibility or specific social flows if needed
export const socialLogin = loginUser;
export const registerUser = loginUser;
