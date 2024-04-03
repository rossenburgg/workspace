import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import PasswordInputScreen from './screens/PasswordInputScreen'; // Import PasswordInputScreen
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App component mounted, setting up navigation with AuthProvider context.');
  return (
    <AuthProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="PasswordInput" component={PasswordInputScreen} options={{ title: 'Enter Password' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}