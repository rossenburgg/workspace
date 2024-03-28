import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import MainAppStack from './MainAppStack';

const AppNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          console.log('User is logged in');
          setIsLoggedIn(true);
        } else {
          console.log('User is not logged in');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error.message, error.stack);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <>
          {console.log('User is authenticated: Navigating to MainAppStack.')}
          <MainAppStack />
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