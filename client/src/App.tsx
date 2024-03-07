import React from 'react';
import CastList from './components/CastList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Farcaster Client</h1>
      <CastList />
    </div>
  );
}

export default App;
