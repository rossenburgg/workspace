import React, { createContext, useContext, useState } from 'react';
import { firebase } from '../config/firebaseConfig'; // Ensure you have this config file set up with Firebase credentials

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (email, password) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // Send verification email
      const user = firebase.auth().currentUser;
      await user.sendEmailVerification();
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setCurrentUser(firebase.auth().currentUser);
      console.log('User logged in:', firebase.auth().currentUser.email);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log('OTP sent:', data.message);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    sendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};