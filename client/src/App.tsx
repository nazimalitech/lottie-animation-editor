import React from 'react';
import './App.css';
import { AnimationEditor, Chat } from './components';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Lottie Animation Editor</h1>
      </header>
      <main>
        <AnimationEditor />
        <Chat />
      </main>
    </div>
  );
};

export default App;
