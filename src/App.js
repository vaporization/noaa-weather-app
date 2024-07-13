import React from 'react';
import './App.css';
import LiveDataPage from './LiveDataPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Live Weather and Water Data</h1>
      </header>
      <main>
        <LiveDataPage />
      </main>
    </div>
  );
}

export default App;
