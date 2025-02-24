import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './style.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <img src="/FreshRoulette.svg" alt="Fresh Roulette Logo" className="logo" />
          </Link>

          {/* Hamburger Menu for Mobile */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="mobile-menu">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              {/* <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link> */}
            </nav>
          )}
        </header>

        <main className="content">
          <section className="cta-section">
            <h2 className="cta-title">What’s on the menu this week</h2>
            <p className="cta-subtext">
              Don’t let the mental gymnastics of deciding what to eat keep you from cooking. We’ll help you plan and let you cook.
            </p>
            <button className="cta-button">Get Started</button>
          </section>

          <div className="illustration-container">
            <img src="../../Illustration.png" alt="Illustration" className="illustration" />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
