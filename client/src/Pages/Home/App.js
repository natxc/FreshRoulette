import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './style.css';
import MenuSelection from '../MenuSelection/MenuSelection';
import ReviewMenu from '../MenuSelection/ReviewMenu';
import GroceryList from '../GroceryList/GroceryList'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <Link to="/" className="logo-container">
            <img src="/FreshRoulette.svg" alt="Fresh Roulette Logo" className="logo" />
          </Link>
        </header>

        <Routes>
          <Route path="/" element={
            <main className="content">
              <section className="cta-section">
                <h2 className="cta-title">What’s on the menu this week</h2>
                <p className="cta-subtext">
                  Don’t let the mental gymnastics of deciding what to eat keep you from cooking. We’ll help you plan and let you cook.
                </p>
                <Link to="/menu">
                  <button className="cta-button">Get Started</button>
                </Link>
              </section>
              <div className="illustration-container">
                <img src="../../Illustration.png" alt="Illustration" className="illustration" />
              </div>
            </main>
          } />
          <Route path="/menu" element={<MenuSelection />} />
          <Route path="/review-menu" element={<ReviewMenu />} />
          <Route path="/grocery-list" element={<GroceryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
