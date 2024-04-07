import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';
import SettingsForm from './components/SettingsForm'; // Ensure this import path is correct

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [initialSettings, setInitialSettings] = useState({ profileVisibility: true, notificationPreferences: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Retrieve the JWT token from AsyncStorage
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        const response = await axios.get(`${process.env.REACT_NATIVE_BACKEND_URL}/api/settings`, { // Use environment variable for backend URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInitialSettings(response.data);
        console.log('Settings fetched successfully');
      } catch (error) {
        console.error('Error fetching settings:', error);
        console.error(error.message); // Logging the full error message and trace
        Alert.alert('Error', 'Failed to fetch settings.');
      }
    };

    fetchSettings();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove the JWT token from AsyncStorage
      console.log('User signed out successfully');
      navigation.navigate('SigninScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      console.error(error.message); // Logging the full error message and trace
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <SettingsForm initialSettings={initialSettings} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SettingsScreen;