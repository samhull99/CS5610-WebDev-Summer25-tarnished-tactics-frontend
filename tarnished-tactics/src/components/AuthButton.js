import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

function AuthButton() {
  const { user, signIn, signOut, loading, isInitialized } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [componentKey, setComponentKey] = useState(0); // Force re-render
  const googleButtonRef = useRef(null);
  const previousUserRef = useRef(user);

  // Force component re-render when user signs in
  useEffect(() => {
    if (!previousUserRef.current && user && isInitialized) {
      // Force complete re-render by changing key
      setComponentKey(prev => prev + 1);
    }
    previousUserRef.current = user;
  }, [user, isInitialized]);

  useEffect(() => {
    if (isInitialized && !user && !loading && window.google && googleButtonRef.current) {
      // Aggressive cleanup before rendering
      if (window.google?.accounts?.id?.cancel) {
        window.google.accounts.id.cancel();
      }
      
      setTimeout(() => {
        renderGoogleButton();
      }, 50);
    }
  }, [isInitialized, user, loading, componentKey]);

  const renderGoogleButton = () => {
    if (googleButtonRef.current && window.google) {
      googleButtonRef.current.innerHTML = '';
      
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          width: 200
        }
      );
    }
  };

  // Rest of your component stays the same...
  const handleManualSignIn = () => {
    setIsSigningIn(true);
    try {
      signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setTimeout(() => setIsSigningIn(false), 2000);
    }
  };

console.log('User object:', user);
console.log('User picture URL:', user?.picture);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading || !isInitialized) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (user) {
    return (
      <div className="auth-container" key={`auth-${componentKey}`}>
        <div className="user-info">
          <img
  src={user.picture}
  alt={user.name}
  className="user-avatar"
  referrerPolicy="no-referrer"
  crossOrigin="anonymous"
/>
          <span className="user-name">{user.name}</span>
        </div>
        <button onClick={handleSignOut} className="auth-button sign-out">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="sign-in-container" key={`signin-${componentKey}`}>
      {!user && <div ref={googleButtonRef} className="google-signin-button" />}
      {(!window.google || isSigningIn) && (
        <button
          onClick={handleManualSignIn}
          disabled={isSigningIn}
          className="auth-button sign-in manual"
        >
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
      )}
    </div>
  );
}

export default AuthButton;