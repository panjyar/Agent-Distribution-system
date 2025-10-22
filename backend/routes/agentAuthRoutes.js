import express from 'express';
import {
  loginAgent,
  getAgentProfile,
} from '../controllers/agentAuthController.js';
import { protectAgent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(loginAgent);
router.route('/profile').get(protectAgent, getAgentProfile);

export default router;