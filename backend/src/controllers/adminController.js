import { Episode, Contestant, Channel } from '../models/index.js';

export const createEpisode = async (req, res, next) => {
  try {
    const { title, episodeNumber, description, mediaUrl } = req.body;
    if (!title || !episodeNumber) {
      res.status(400);
      throw new Error('Please provide title and episodeNumber');
    }

    const episode = await Episode.create({
      title,
      episodeNumber,
      description,
      mediaUrl,
    });

    res.status(201).json({
      success: true,
      message: 'New episode registered',
      data: episode,
    });
  } catch (error) {
    next(error);
  }
};

export const createContestant = async (req, res, next) => {
  try {
    const { name, gender, avatar, bio, location, mbti } = req.body;
    if (!name || !gender || !avatar) {
      res.status(400);
      throw new Error('Please provide name, gender, and avatar');
    }

    const contestant = await Contestant.create({
      name,
      gender,
      avatar,
      bio,
      location,
      mbti,
      popularity: 60,
    });

    res.status(201).json({
      success: true,
      message: 'New contestant registered in database',
      data: contestant,
    });
  } catch (error) {
    next(error);
  }
};

export const moderateChannel = async (req, res, next) => {
  try {
    const { channelId, action } = req.body;

    if (action === 'delete') {
      await Channel.findByIdAndDelete(channelId);
      return res.status(200).json({
        success: true,
        message: 'Channel deleted successfully',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Moderation action processed',
    });
  } catch (error) {
    next(error);
  }
};
