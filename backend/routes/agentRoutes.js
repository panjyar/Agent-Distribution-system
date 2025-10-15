
import express from 'express';
import {
  createAgent,
  getAgents,
  deleteAgent,
} from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createAgent).get(protect, getAgents);
router.route('/:id').delete(protect, deleteAgent);

export default router;