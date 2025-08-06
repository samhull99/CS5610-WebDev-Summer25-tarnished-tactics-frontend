import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tarnished_tactics_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('tarnished_tactics_user');
      }
    }
  }, []);

  // Initialize Google Identity Services
  const initializeGoogleAuth = async () => {
    try {
      // Load the Google Identity Services script
      await new Promise((resolve, reject) => {
        if (window.google) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle the credential response from Google
  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const responsePayload = decodeJwtResponse(response.credential);
      
      const userData = {
        id: responsePayload.sub, // Google User ID
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture,
        token: response.credential
      };
      
      setUser(userData);
      
      // Save user to localStorage
      localStorage.setItem('tarnished_tactics_user', JSON.stringify(userData));
      
      // Optional: Send user data to your backend for registration/login
      await registerOrLoginUser(userData);
      
    } catch (error) {
      console.error('Error handling credential response:', error);
    }
  };

  // Decode JWT response
  const decodeJwtResponse = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const signIn = () => {
    if (!window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }
    
    // Trigger the Google sign-in popup
    window.google.accounts.id.prompt();
  };

  const signOut = async () => {
    try {
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      setUser(null);
      
      // Remove user from localStorage
      localStorage.removeItem('tarnished_tactics_user');
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Optional: Register/login user in your backend
  const registerOrLoginUser = async (userData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: userData.id,
          name: userData.name,
          email: userData.email,
          picture: userData.picture
        })
      });

      if (!response.ok) {
        console.warn('Backend user registration failed, but continuing with frontend auth');
      }
    } catch (error) {
      console.warn('Backend user registration failed:', error);
      // Continue anyway - frontend auth still works
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    signIn,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};