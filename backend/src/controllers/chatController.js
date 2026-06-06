import { Message, Channel } from '../models/index.js';

export const getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find();
    res.status(200).json({
      success: true,
      data: channels,
    });
  } catch (error) {
    next(error);
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId }).sort({ timestamp: 1 });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { channelId, senderName, text } = req.body;
    if (!channelId || !senderName || !text) {
      res.status(400);
      throw new Error('Please provide channelId, senderName, and text');
    }

    const message = await Message.create({
      channelId,
      senderName,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
