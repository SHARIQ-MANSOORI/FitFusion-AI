import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dashboard-hero">
        <div className="dashboard-hero-pill">⚡ AI Health & Fitness Engine</div>
        <h1>Welcome, {user?.name}</h1>
        <p>
          Your personalized fitness hub. Generate custom workout plans, build healthy nutrition guides, consult your AI coach, and monitor your body transformation.
        </p>
      </div>

      <div className="features-grid">
        <Link to="/workout" className="feature-card">
          <div>
            <div className="feature-icon-wrapper">🏋️‍♂️</div>
            <div className="feature-title">Workout</div>
            <div className="feature-desc">
              Generate AI-tailored exercise routines based on your fitness goals, weight, height, and experience level.
            </div>
          </div>
          <span className="feature-action">
            Open Workout Generator &rarr;
          </span>
        </Link>

        <Link to="/diet" className="feature-card">
          <div>
            <div className="feature-icon-wrapper">🥗</div>
            <div className="feature-title">Diet</div>
            <div className="feature-desc">
              Get customized daily meal plans and macro-friendly meal breakdowns tailored to your diet preferences and calories.
            </div>
          </div>
          <span className="feature-action">
            Create Diet Plan &rarr;
          </span>
        </Link>

        <Link to="/chat" className="feature-card">
          <div>
            <div className="feature-icon-wrapper">💬</div>
            <div className="feature-title">Chat</div>
            <div className="feature-desc">
              Have a conversation with your intelligent AI coach to ask form questions, get recovery advice, and stay motivated.
            </div>
          </div>
          <span className="feature-action">
            Ask AI Coach &rarr;
          </span>
        </Link>

        <Link to="/progress" className="feature-card">
          <div>
            <div className="feature-icon-wrapper">📈</div>
            <div className="feature-title">Progress</div>
            <div className="feature-desc">
              Track weight milestones and workout reflections over time to see your continuous physical progression.
            </div>
          </div>
          <span className="feature-action">
            View Progress Tracker &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
