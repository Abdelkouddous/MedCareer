import express from 'express';
import { sendMessage, getConversation, getMessages } from '../controllers/messageController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateUser);

router.post('/send-message', sendMessage);
router.get('/get-conversation/:jobId', getConversation);
router.get('/get-messages/:conversationId', getMessages);

export default router;