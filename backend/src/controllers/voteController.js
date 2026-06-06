import { User, Contestant, Vote } from '../models/index.js';

export const castVote = async (req, res, next) => {
  try {
    const { userId, contestantId, episodeId } = req.body;
    if (!userId || !contestantId) {
      res.status(400);
      throw new Error('Please provide userId and contestantId');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.balanceCoins < 10) {
      res.status(400);
      throw new Error('Insufficient Coins balance');
    }

    const contestant = await Contestant.findById(contestantId);
    if (!contestant) {
      res.status(404);
      throw new Error('Contestant not found');
    }

    // Process balances & metrics
    user.balanceCoins -= 10;
    if (!user.achievements.includes('First Vote')) {
      user.achievements.push('First Vote');
    }
    await user.save();

    contestant.votes += 1;
    contestant.popularity = Math.min(100, contestant.popularity + 1);
    await contestant.save();

    const vote = await Vote.create({
      userId,
      contestantId,
      episodeId,
      coinsDeducted: 10,
    });

    res.status(200).json({
      success: true,
      message: 'Vote registered successfully',
      data: {
        vote,
        newBalanceCoins: user.balanceCoins,
        contestantVotes: contestant.votes,
        contestantPopularity: contestant.popularity,
      },
    });
  } catch (error) {
    next(error);
  }
};
