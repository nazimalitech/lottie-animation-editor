import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { AnimationEditor, Chat } from '../components';
import { clearUser } from '../redux/userSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    navigate('/');
  }

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lottie Animation Editor</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main>
        <AnimationEditor />
        <Chat />
      </main>
    </div>
  );
};

export default Home;
