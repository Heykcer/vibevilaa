import { User, Transaction } from '../models/index.js';

export const purchasePackage = async (req, res, next) => {
  try {
    const { userId, coinsAmount, gemsAmount, price } = req.body;
    if (!userId || (!coinsAmount && !gemsAmount) || !price) {
      res.status(400);
      throw new Error('Please provide userId, coins/gems details, and pricing');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Process balances additions
    if (coinsAmount) user.balanceCoins += coinsAmount;
    if (gemsAmount) user.balanceGems += gemsAmount;
    await user.save();

    const transaction = await Transaction.create({
      userId,
      amountCoins: coinsAmount || 0,
      amountGems: gemsAmount || 0,
      pricePaid: price,
      paymentStatus: 'succeeded',
      transactionType: 'deposit',
    });

    res.status(200).json({
      success: true,
      message: 'Transaction successfully processed via Stripe mockup',
      data: {
        transaction,
        newBalanceCoins: user.balanceCoins,
        newBalanceGems: user.balanceGems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const upgradePremium = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400);
      throw new Error('Please provide userId');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.balanceGems < 150) {
      res.status(400);
      throw new Error('Insufficient Gems balance for premium upgrade');
    }

    user.balanceGems -= 150;
    user.isPremium = true;
    await user.save();

    const transaction = await Transaction.create({
      userId,
      amountCoins: 0,
      amountGems: -150,
      pricePaid: 0,
      paymentStatus: 'succeeded',
      transactionType: 'purchase',
    });

    res.status(200).json({
      success: true,
      message: 'Premium membership activated successfully',
      data: {
        transaction,
        newBalanceGems: user.balanceGems,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    next(error);
  }
};
