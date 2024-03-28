import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import colorPalette from '../config/colorPalette'; // Importing the color palette for consistent styling

function PermissionScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          console.log('Location permission already granted.');
          navigation.replace('Main');
        } else {
          setIsLoading(false); // Only show the permission request button if permission has not been granted
        }
      } catch (error) {
        console.error('Error checking location permission:', error.message, error.stack);
        Alert.alert('An error occurred while checking location permissions. Please try again.');
        setIsLoading(false);
      }
    })();
  }, [navigation]);

  const handlePermissionRequest = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        console.log('Location permission granted after button press.');
        navigation.replace('Main');
      } else {
        console.log('Location permission denied after button press.');
        Alert.alert('Permission to access location was denied. Please enable it from settings.');
      }
    } catch (error) {
      console.error('Error requesting location permission after button press:', error.message, error.stack);
      Alert.alert('An error occurred while requesting location permissions. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colorPalette.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>We need your permission to access your location</Text>
      <Button title="Grant Permission" onPress={handlePermissionRequest} color={colorPalette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.background, // Using color from color palette for background
  },
  text: {
    color: colorPalette.text, // Using color from color palette for text
  },
});

export default PermissionScreen;