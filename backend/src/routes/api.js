import express from 'express';
import { getStatus, getWelcome } from '../controllers/indexController.js';

const router = express.Router();

// Base API endpoints
router.get('/', getWelcome);
router.get('/status', getStatus);

export default router;
