import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  role: string;
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: {
    type: string;
    text: string;
  }[];
}

const AnthropicChat: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<AnthropicResponse>(
        'http://127.0.0.1:8080/generate_chat_anthropic',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 100,
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.content[0].text;
      setResponseMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Chat with Anthropic API</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h3>Response:</h3>
        <p>{responseMessage}</p>
      </div>
    </div>
  );
};

export default AnthropicChat;
