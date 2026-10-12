import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import FormattedAIOutput from '../components/FormattedAIOutput';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  return (
    <div>
      <div className="card chat-shell">
        <div className="card-header">
          <h2>AI Fitness Coach</h2>
          <p className="card-subtitle">
            Get instant guidance on training techniques, recovery principles, and nutrition habits.
          </p>
        </div>

        {error && <p className="error-text">⚠️ {error}</p>}

        <div className="chat-suggestions">
          <button
            type="button"
            className="chat-chip"
            onClick={() => handleSuggestionClick('What should I eat right after a high-intensity workout?')}
          >
            🥗 Post-workout nutrition
          </button>
          <button
            type="button"
            className="chat-chip"
            onClick={() => handleSuggestionClick('How many rest days should I take between leg workouts?')}
          >
            ⏱️ Recovery & rest days
          </button>
          <button
            type="button"
            className="chat-chip"
            onClick={() => handleSuggestionClick('How do I safely increase my progressive overload?')}
          >
            🏋️ Progressive overload tips
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-message coach-message" style={{ width: '100%', maxWidth: '100%' }}>
              <strong>Coach</strong>
              <span>
                👋 Hello! I am your AI Fitness Coach. Feel free to ask about workout routines, proper form, nutrition strategies, or injury prevention. How can I help you today?
              </span>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'coach-message'}`}
              >
                <strong>{msg.role === 'user' ? 'You' : 'Coach'}: </strong>
                {msg.role === 'coach' ? (
                  <FormattedAIOutput content={msg.text} compact />
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="chat-message coach-message">
              <strong>Coach</strong>
              <span className="loading-text" style={{ margin: 0 }}>Thinking and analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
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

      <p className="safety-note">
        <span>⚠️</span>
        <span>AI coach suggestions are for educational guidance only. Always consult medical or certified sports specialists for clinical advice.</span>
      </p>
    </div>
  );
};

export default Chat;
