import React from 'react';
import './App.css';
import { Login } from './features/Login/Login';
import { Register } from './features/Login/Register';
import { Dashboard } from "./features/Dashboard/Dashboard";
import { Front } from './features/FrontPage/Front';
import { pizzaEatingAnimation } from './Animations/animations';
import {Routes, Route, Link} from "react-router-dom";
import { FoodForm } from './features/FoodInsertion/FoodForm';


window.onload = pizzaEatingAnimation;

function App() {
  return (
    <div className="App"> 
        <Routes>
          <Route path='/' element={<Front />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/foodform' element={<FoodForm />} />
        </Routes>
    </div>
  );
}

export default App;
