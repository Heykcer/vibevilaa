import { User } from '../models/index.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Creating mock hashed password (in production use bcrypt)
    const user = await User.create({
      name,
      email,
      password, // in production hash it
      achievements: ['First Login'],
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balanceCoins: user.balanceCoins,
        balanceGems: user.balanceGems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      res.status(401);
      throw new Error('Invalid email or password');
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
    next(error);
  }
};

export const socialLogin = async (req, res, next) => {
  try {
    const { provider, socialToken, email, name } = req.body;
    if (!provider || !socialToken || !email) {
      res.status(400);
      throw new Error('Please provide provider, token, and email');
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Social User',
        email,
        password: `social-auth-${provider}-${Date.now()}`,
        achievements: ['Social Connection'],
      });
    }

    res.status(200).json({
      success: true,
      message: `Authentication with ${provider} successful`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balanceCoins: user.balanceCoins,
        balanceGems: user.balanceGems,
      },
    });
  } catch (error) {
    next(error);
  }
};
