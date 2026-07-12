import { Message } from '@/store/aiStore';

export async function* streamChat(message: string, history: Message[]) {
  const token = localStorage.getItem('transitops_token');
  
  const response = await fetch('http://localhost:4000/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error('Failed to connect to AI service');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // Process SSE lines
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || ''; // Keep the incomplete line in the buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            yield parsed.text;
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e, data);
        }
      }
    }
  }
}
