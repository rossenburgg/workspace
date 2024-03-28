import React, { useContext, createContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainScreen from '../screens/MainScreen';
import PermissionScreen from '../screens/PermissionScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';
import SignupScreen from '../screens/SignupScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();

// Create a context for managing authentication state
const AuthContext = createContext();

function AppNavigator() {
  const [state, setState] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
  });

  useEffect(() => {
    // Check the async storage for a token to validate the current authentication state
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Restoring token failed', e);
      }
      // After restoring token, update state with authentication information
      setState({ isLoading: false, isSignout: false, userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, data);
          const { token } = response.data;
          await AsyncStorage.setItem('userToken', token);
          setState({ isLoading: false, isSignout: false, userToken: token });
        } catch (error) {
          console.error('SignIn error:', error);
          throw new Error('SignIn failed');
        }
      },
      signOut: async () => {
        setState({ isLoading: false, isSignout: true, userToken: null });
        await AsyncStorage.removeItem('userToken'); // Remove the token on sign out
      },
      signUp: async (data) => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, data);
          const { token } = response.data;
          await AsyncStorage.setItem('userToken', token);
          setState({ isLoading: false, isSignout: false, userToken: token });
        } catch (error) {
          console.error('SignUp error:', error);
          throw new Error('SignUp failed');
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={OnboardingScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            // User is signed in
            <>
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Permission" component={PermissionScreen} />
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="UserDashboard" component={UserDashboard} />
              <Stack.Screen name="Admin" component={AdminScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default AppNavigator;