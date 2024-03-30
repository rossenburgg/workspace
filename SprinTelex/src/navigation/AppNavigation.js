import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthContext } from '../context/AuthContext';
import { REACT_APP_SERVER_URL } from '@env'; 

const AppNavigation = () => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.get(`${REACT_APP_SERVER_URL}/api/auth/check`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.isAuthenticated) {
            authContext.setToken(token);
          } else {
            authContext.setToken(null);
          }
        } catch (error) {
          console.error('Error checking authentication status:', error.message, error.stack);
          authContext.setToken(null);
        }
      } else {
        authContext.setToken(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [authContext]);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      {authContext.token ? <BottomTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;