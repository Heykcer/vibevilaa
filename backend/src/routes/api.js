import express from 'express';
import { getStatus, getWelcome } from '../controllers/indexController.js';
import { registerUser, loginUser, socialLogin } from '../controllers/authController.js';
import {
  getContestants,
  getContestantById,
  getRankings,
  sendGift,
} from '../controllers/contestantController.js';
import {
  getChannels,
  getChannelMessages,
  sendMessage,
  createChannel,
} from '../controllers/chatController.js';
import { castVote } from '../controllers/voteController.js';
import { purchasePackage, upgradePremium } from '../controllers/walletController.js';
import {
  createEpisode,
  createContestant,
  moderateChannel,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Base API endpoints
router.get('/', getWelcome);
router.get('/status', getStatus);

// 2. Auth routes
// These are not protected because they are used to establish the token and sync the user
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/social', socialLogin);

// 3. Contestants routes
router.get('/contestants', getContestants);
router.get('/contestants/rankings', getRankings);
router.get('/contestants/:id', getContestantById);
router.post('/contestants/:id/gift', protect, sendGift);

// 4. Community & Chat routes
router.get('/channels', getChannels);
router.post('/channels', createChannel);
router.get('/channels/:channelId/messages', getChannelMessages);
router.post('/channels/messages', sendMessage);

// 5. Voting routes
router.post('/votes/cast', protect, castVote);

// 6. Wallet transactions
router.post('/wallet/purchase', protect, purchasePackage);
router.post('/wallet/premium', protect, upgradePremium);

// 7. Admin endpoints (In a real app, you'd have an 'admin' middleware too)
router.post('/admin/episodes', protect, createEpisode);
router.post('/admin/contestants', protect, createContestant);
router.post('/admin/moderate', protect, moderateChannel);

export default router;
