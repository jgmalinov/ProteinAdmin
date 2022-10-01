import React from 'react';
import './App.css';
import { Login } from './features/Login/Login';
import { pizzaEatingAnimation } from './Animations/animations';

window.onload = pizzaEatingAnimation;

function App() {
  return (
    <div className="App"> 
      <header className="App-header">
      </header>
      <div className='main'>
        <Login />
      </div>
    </div>
  );
}

export default App;
