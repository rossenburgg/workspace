import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReelsScreen from '../screens/ReelsScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';

const Stack = createStackNavigator();

const MainAppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reels" component={ReelsScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainAppStack;