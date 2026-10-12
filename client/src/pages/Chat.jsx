import { useState } from 'react';
import api from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setError('');
    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/ask', { message: trimmed });
      setMessages((prev) => [...prev, { role: 'coach', text: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Fitness Coach</h2>
      {error && <p className="error-text">{error}</p>}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.role === 'user' ? 'user-message' : 'coach-message'}`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Coach'}: </strong>
            {msg.role === 'coach' ? (
              <pre className="ai-plan" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</pre>
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a fitness question..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
