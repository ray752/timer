import React from 'react';
import './App.css';
import Timer from './components/Timer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Tabata Timer</p>
        <Timer />
      </header>
    </div>
  );
}

export default App;
