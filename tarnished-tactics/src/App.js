import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/AuthContext';
import AuthButton from './components/AuthButton';
import BuildsPage from './components/BuildsPage';
import GuidesPage from './components/GuidesPage';
import GuideDetailPage from './components/GuideDetailPage';
import MyBuildsPage from './components/MyBuildsPage';
import BuildDetailPage from './components/BuildDetailPage';
import { useAuth } from './components/AuthContext';
import BackgroundMusic from './components/BackgroundMusic';
import { motion, AnimatePresence } from 'framer-motion';

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
      <p>"What was her prayer? Her wish, her confession? There is no one left to answer, and Marika never returned home again."</p>
      <h1>Welcome to Tarnished Tactics</h1>
      <p>Your ultimate Elden Ring build generator and guide resource.</p>
      
      {/* How to Use Section */}
      <div className="how-to-use">
        <h2>How to Use Tarnished Tactics</h2>
        <div className="usage-steps">
          <div className="usage-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h3>Browse Builds</h3>
              <p>Explore community builds and preset builds in the <strong>Builds</strong> section to find inspiration for your next character.</p>
            </div>
          </div>
          
          <div className="usage-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h3>Read Guides</h3>
              <p>Check out the <strong>Guides</strong> section for detailed strategies, tips, and build explanations to master your playstyle.</p>
            </div>
          </div>
          
<div className="usage-step">
  <span className="step-number">3</span>
  <div className="step-content">
    <h3>Create Your Own</h3>
    <p>Sign in to create, save, and share your own custom builds in <strong>My Builds</strong>. Track stats, equipment, spells, and build strategies.</p>
  </div>
</div>

<div className="usage-step">
  <span className="step-number">4</span>
  <div className="step-content">
    <h3>Generate AI Guides</h3>
    <p>Use our AI-powered guide generator to create detailed strategies for any build. Simply select a build and click <strong>"Generate Guide"</strong> to get comprehensive gameplay tips, combat strategies, and progression advice tailored to that specific build.</p>
  </div>
</div>

<div className="usage-step">
  <span className="step-number">5</span>
  <div className="step-content">
    <h3>Share & Collaborate</h3>
    <p>Make your builds and guides public to share with the community, or keep them private for your personal use.</p>
  </div>
</div>
        </div>
      </div>

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
  const location = useLocation();

  return (
    <div className="app">
      {/* Header - stays the same */}
<header 
  className="header"
  style={{
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/ER_Location_Shaman_Village.png)`
  }}
>
        <div className="title-section">
          <Link to="/" className="title-link">
            <h1 className="title">Tarnished Tactics</h1>
          </Link>
          <span className="tagline">Dodge and hit.</span>
        </div>
        <div className="header-controls">
          <span className="song-title">Shaman Village OST</span>
          <BackgroundMusic audioSrc={`${process.env.PUBLIC_URL}/audio/shamanvillage.mp3`} />
          <div className="header-auth">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Navigation - stays the same */}
      <Navigation />

      {/* Animated main content area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/builds" element={<BuildsPage />} />
              <Route path="/builds/:buildId" element={<BuildDetailPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:guideId" element={<GuideDetailPage />} />
              <Route path="/my-builds" element={<MyBuildsPage />} />
              <Route path="*" element={
                <div className="not-found">
                  <h1>Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <Link to="/" className="create-button">Go Home</Link>
                </div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
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