import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./style.css";
import Header from '../../Common/Header';
import ErrorBoundary from '../../Common/ErrorBoundary';
import ScrollToTopButton from '../../Common/ScrollToTopButton';
import About from '../About/About.js';
import SlotMachine from "../SlotMachine/SlotMachine.js";


function App() {
  return (
    <ErrorBoundary>
    <Router>
      <Routes>
    
        <Route path="/" element={<div className="App-Container">
            <Header />
        <h1 className="mt-5 text-center">What's Cookin' This Week?</h1>
            <SlotMachine />
        <ScrollToTopButton />
        <footer className="container text-left">
          <p>&copy; 2024</p>
        </footer>
      </div>
        }/>
          <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
