import React from 'react';
import "./App.css";
import SlotMachine from "./SlotMachine";
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import ScrollToTopButton from './ScrollToTopButton';
import About from './About';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
