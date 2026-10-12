import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <div>
        <Link to="/workout">Workout</Link>
        <br />
        <Link to="/diet">Diet</Link>
        <br />
        <Link to="/chat">Chat</Link>
        <br />
        <Link to="/progress">Progress</Link>
      </div>
    </div>
  );
};

export default Dashboard;
