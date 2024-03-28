import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import ReelsScreen from '../screens/ReelsScreen';
import ChatScreen from '../screens/ChatScreen';
import OtherScreen from '../screens/OtherScreen';
import UploadReelScreen from '../screens/UploadReelScreen';
import { Ionicons } from '@expo/vector-icons';
import { Modal, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = focused ? 'ios-map' : 'ios-map-outline';
            } else if (route.name === 'Reels') {
              iconName = focused ? 'ios-videocam' : 'ios-videocam-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
            } else if (route.name === 'Upload') {
              iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-settings' : 'ios-settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Reels" component={ReelsScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen
          name="Upload"
          component={OtherScreen} // Temporarily using OtherScreen to satisfy the component prop requirement
          options={{ title: 'Upload Reel' }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsUploadModalVisible(true);
            },
          }}
        />
        <Tab.Screen name="Settings" component={OtherScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isUploadModalVisible}
        onRequestClose={() => {
          setIsUploadModalVisible(!isUploadModalVisible);
        }}
      >
        <UploadReelScreen setIsUploadModalVisible={setIsUploadModalVisible} />
        <TouchableOpacity
          onPress={() => setIsUploadModalVisible(false)}
          style={{ marginTop: 20, alignSelf: 'center', backgroundColor: 'tomato', padding: 10, borderRadius: 5 }}
        >
          <Ionicons name="ios-close" size={24} color="white" />
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default BottomTabNavigator;