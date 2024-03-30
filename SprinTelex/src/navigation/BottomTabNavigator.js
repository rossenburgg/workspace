import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ReelsScreen from '../screens/ReelsScreen';
import UserProfileScreen from '../screens/UserProfileScreen'; // Corrected import for UserProfileScreen
import UploadScreen from '../screens/UploadScreen';
import ChatScreen from '../chat/components/ChatScreen';
import SearchScreen from '../screens/SearchScreen'; // Importing the new SearchScreen

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Reels') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Search') { // Setting the icon for the Search tab
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      })}
    >
      <Tab.Screen name="Reels" component={ReelsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={UserProfileScreen} options={{ title: 'Profile', headerShown: false}}  /> 
      <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: false, title: 'Chat' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false, title: 'Search' }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;