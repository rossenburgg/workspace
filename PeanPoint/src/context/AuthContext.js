import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
          console.log('User token found:', token);
          const response = await axios.get(`http://192.168.8.130:3000/api/validateToken`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.role) {
            setUserDetails(response.data);
          }
        } else {
          console.log('No user token found');
        }
      } catch (error) {
        console.error('Error fetching user token:', error.message, error.stack);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const signIn = async (data) => {
    try {
      const response = await axios.post(`http://192.168.8.130:3000/api/login`, data);
      const { token, role } = response.data;
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      console.log('User logged in successfully:', token);
      setUserDetails({ role }); // Assuming the API response includes the user's role
    } catch (error) {
      console.error('Login failed:', error.message, error.stack);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUserDetails(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error.message, error.stack);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, signIn, signOut, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;