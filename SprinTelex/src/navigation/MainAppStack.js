import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReelsScreen from '../screens/ReelsScreen';

const Stack = createStackNavigator();

const MainAppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Reels" component={ReelsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainAppStack;