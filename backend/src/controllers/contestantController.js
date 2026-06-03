import { Contestant, User } from '../models/index.js';

export const getContestants = async (req, res, next) => {
  try {
    const { gender, search } = req.query;
    let query = {};

    if (gender && gender !== 'All') {
      query.gender = gender.toLowerCase() === 'girls' ? 'girl' : 'boy';
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const contestants = await Contestant.find(query);
    res.status(200).json({
      success: true,
      count: contestants.length,
      data: contestants,
    });
  } catch (error) {
    next(error);
  }
};

export const getContestantById = async (req, res, next) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (!contestant) {
      res.status(404);
      throw new Error('Contestant not found');
    }

    res.status(200).json({
      success: true,
      data: contestant,
    });
  } catch (error) {
    next(error);
  }
};

export const getRankings = async (req, res, next) => {
  try {
    const { type } = req.query; // Weekly, All Time, Fanbases

    // Default popularity metric sorting
    let contestantsList = await Contestant.find().sort({ popularity: -1 });

    if (type === 'Fanbases') {
      // simulated fanbase sort: parse K/M members
      contestantsList.sort((a, b) => {
        const valA = parseFloat(a.fanbaseMembers.replace('K', '').replace('M', '000'));
        const valB = parseFloat(b.fanbaseMembers.replace('K', '').replace('M', '000'));
        return valB - valA;
      });
    }

    res.status(200).json({
      success: true,
      data: contestantsList,
    });
  } catch (error) {
    next(error);
  }
};

export const sendGift = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, cost, popularityBoost } = req.body;
    if (!userId || !cost || !popularityBoost) {
      res.status(400);
      throw new Error('Please provide userId, cost, and popularityBoost');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.balanceCoins < cost) {
      res.status(400);
      throw new Error('Insufficient Coins balance');
    }

    const contestant = await Contestant.findById(id);
    if (!contestant) {
      res.status(404);
      throw new Error('Contestant not found');
    }

    user.balanceCoins -= cost;
    if (!user.achievements.includes('Gift Sent')) {
      user.achievements.push('Gift Sent');
    }
    await user.save();

    contestant.popularity = Math.min(100, contestant.popularity + Math.round(popularityBoost / 10));
    contestant.votes += popularityBoost * 5;
    await contestant.save();

    res.status(200).json({
      success: true,
      message: 'Gift sent successfully',
      data: {
        newBalanceCoins: user.balanceCoins,
        contestantVotes: contestant.votes,
        contestantPopularity: contestant.popularity,
        contestant,
      },
    });
  } catch (error) {
    next(error);
  }
};
