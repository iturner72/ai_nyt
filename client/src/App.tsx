import React from 'react';
import './App.css';
import CastList from './components/CastList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Farcaster Client</h1>
        <div className="flex flex-row p-12 space-x-4">
        <CastList />
      </div>
    </div>
  );
}

export default App;
