import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { streamChatResponse } from './services/geminiService.js';

const router = Router();

router.post('/chat', authenticate, async (req, res) => {
  const { message, history } = req.body;
  const user = (req as any).user;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    const stream = await streamChatResponse(message, history || [], user?.role || 'user');

    for await (const chunk of stream) {
      if (chunk.text) {
        // Send data formatted for Server-Sent Events
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'An error occurred during chat.' })}\n\n`);
    res.end();
  }
});

export default router;
