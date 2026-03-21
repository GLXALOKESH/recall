import express from 'express';
import { createSession } from '../controllers/session.controller.js';

const router = express.Router();

// Create a new session
router.post('/', createSession);

export default router;
