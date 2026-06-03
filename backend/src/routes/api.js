import express from 'express';
import { getStatus, getWelcome } from '../controllers/indexController.js';
import { registerUser, loginUser, socialLogin } from '../controllers/authController.js';
import {
  getContestants,
  getContestantById,
  getRankings,
  sendGift,
} from '../controllers/contestantController.js';
import { getChannels, getChannelMessages, sendMessage } from '../controllers/chatController.js';
import { castVote } from '../controllers/voteController.js';
import { purchasePackage, upgradePremium } from '../controllers/walletController.js';
import {
  createEpisode,
  createContestant,
  moderateChannel,
} from '../controllers/adminController.js';

const router = express.Router();

// 1. Base API endpoints
router.get('/', getWelcome);
router.get('/status', getStatus);

// 2. Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/social', socialLogin);

// 3. Contestants routes
router.get('/contestants', getContestants);
router.get('/contestants/rankings', getRankings);
router.get('/contestants/:id', getContestantById);
router.post('/contestants/:id/gift', sendGift);

// 4. Community & Chat routes
router.get('/channels', getChannels);
router.get('/channels/:channelId/messages', getChannelMessages);
router.post('/channels/messages', sendMessage);

// 5. Voting routes
router.post('/votes/cast', castVote);

// 6. Wallet transactions
router.post('/wallet/purchase', purchasePackage);
router.post('/wallet/premium', upgradePremium);

// 7. Admin endpoints
router.post('/admin/episodes', createEpisode);
router.post('/admin/contestants', createContestant);
router.post('/admin/moderate', moderateChannel);

export default router;
