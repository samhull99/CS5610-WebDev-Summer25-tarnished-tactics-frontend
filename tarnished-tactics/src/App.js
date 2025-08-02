import React, { useState } from 'react';
import './App.css';
import BuildsPage from './components/BuildsPage';
import GuidesPage from './components/GuidesPage';

function App() {
  const [activeNav, setActiveNav] = useState('Home');

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  const renderPage = () => {
    switch(activeNav) {
      case 'Builds':
        return <BuildsPage />;
      case 'Guides':
        return <GuidesPage />;
      case 'Home':
      default:
        return (
          <div className="home-page">
            <h1>Welcome to Tarnished Tactics</h1>
            <p>Your ultimate Elden Ring build generator and guide resource.</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="title">
          Tarnished Tactics
        </h1>
      </header>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          {['Home', 'Builds', 'Guides'].map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`nav-button ${activeNav === item ? 'active' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content area */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;