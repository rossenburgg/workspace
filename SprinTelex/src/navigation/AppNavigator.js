import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReelsScreen from '../screens/ReelsScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reels" component={ReelsScreen} options={{headerShown: false}}/>
      <Tab.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;