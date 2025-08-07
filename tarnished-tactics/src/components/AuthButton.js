import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

function AuthButton() {
  const { user, signIn, signOut, loading, isInitialized } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Only render Google button when component is mounted and conditions are met
    if (isInitialized && !user && !loading && window.google && googleButtonRef.current) {
      renderGoogleButton();
    }
  }, [isInitialized, user, loading]);

  const renderGoogleButton = () => {
    if (googleButtonRef.current && window.google) {
      // Clear any existing button
      googleButtonRef.current.innerHTML = '';
     
      // Render the new Google Identity Services button
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

  const handleManualSignIn = () => {
    setIsSigningIn(true);
    try {
      signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      // Reset after a short delay
      setTimeout(() => setIsSigningIn(false), 2000);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Don't render anything while loading
  if (loading || !isInitialized) {
    return <div className="auth-loading">Loading...</div>;
  }

  // Show user info and sign out button when signed in
  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <img
            src={user.picture}
            alt={user.name}
            className="user-avatar"
          />
          <span className="user-name">{user.name}</span>
        </div>
        <button onClick={handleSignOut} className="auth-button sign-out">
          Sign Out
        </button>
      </div>
    );
  }

  // Show sign-in options when not signed in
  return (
    <div className="sign-in-container">
      {/* Google's rendered button */}
      <div ref={googleButtonRef} className="google-signin-button" />
     
      {/* Fallback manual button */}
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