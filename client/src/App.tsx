import React from 'react';
import CastList from './components/CastList';
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <div className="text-center bg-amber-50">
        <div>
            <h1 className={'font-semibold text-4xl header my-5'}>ai_nyt</h1>
        </div>
        <NavBar />
        <div className="flex flex-row p-12 space-x-4">
        <CastList />
      </div>
    </div>
  );
}

export default App;
