import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/AuthContext';
import AuthButton from './components/AuthButton';
import BuildsPage from './components/BuildsPage';
import GuidesPage from './components/GuidesPage';
import MyBuildsPage from './components/MyBuildsPage';
import { useAuth } from './components/AuthContext';

function Navigation() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home' },
      { path: '/builds', label: 'Builds' },
      { path: '/guides', label: 'Guides' }
    ];
    
    if (isAuthenticated) {
      baseItems.push({ path: '/my-builds', label: 'My Builds' });
    }
    
    return baseItems;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {getNavItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to Tarnished Tactics</h1>
      <p>Your ultimate Elden Ring build generator and guide resource.</p>
      {isAuthenticated && (
        <div className="home-actions">
          <p>Ready to create your next build? Check out the My Builds section to get started!</p>
          <Link to="/my-builds" className="create-button primary">
            Go to My Builds
          </Link>
        </div>
      )}
      {!isAuthenticated && (
        <div className="home-actions">
          <p>Sign in to create and save your own builds!</p>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <Link to="/" className="title-link">
          <h1 className="title">Tarnished Tactics</h1>
        </Link>
        <div className="header-auth">
          <AuthButton />
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main content area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builds" element={<BuildsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/my-builds" element={<MyBuildsPage />} />
          {/* 404 Route */}
          <Route path="*" element={
            <div className="not-found">
              <h1>Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <Link to="/" className="create-button">Go Home</Link>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;