import express from 'express';
import multer from 'multer';
import { createSession, initSession, deleteSession, getSession, endSession, generateReport } from '../controllers/session.controller.js';
import { streamChat } from '../controllers/chat.controller.js';

const router = express.Router();
const upload = multer();

// Create a new session (legacy mapping)
router.post('/', createSession);

// Initialize a new session from onboarding (Handles topic + file upload)
router.post('/init', upload.single('file'), initSession);

// Get a session by ID
router.get('/:id', getSession);

// Streaming AI Chat Endpoint
router.post('/:id/chat', streamChat);

// Delete a session locally by ID
router.delete('/:id', deleteSession);

// End a session explicitly
router.post('/:id/end', endSession);

// Generate / Get Mastery Report
router.post('/:id/report', generateReport);

export default router;
