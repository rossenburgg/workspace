import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthContext } from '../context/AuthContext';

const AppNavigation = () => {
  const context = useContext(AuthContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          console.log('User is logged in');
          context.setToken(storedToken);
        } else {
          console.log('User is not logged in');
          context.setToken(null);
        }
      } catch (error) {
        console.error('Error checking login status:', error.message, error.stack);
      }
    };

    checkLoginStatus();
  }, [context.setToken]);

  if (context.token === undefined) {
    console.log('Token is undefined, waiting for authentication status check.');
    return null; // or some fallback UI
  }

  return (
    <NavigationContainer>
      {context.token ? (
        <>
          {console.log('User is authenticated: Navigating to BottomTabNavigator.')}
          <BottomTabNavigator />
        </>
      ) : (
        <>
          {console.log('User is not authenticated: Navigating to AuthStack.')}
          <AuthStack />
        </>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;