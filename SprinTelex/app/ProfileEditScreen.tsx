import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook to access the current route and its parameters

  // Set initial form states using route parameters
  const [username, setUsername] = useState(route.params?.username || '');
  const [location, setLocation] = useState(route.params?.location || '');
  const [bio, setBio] = useState(route.params?.bio || '');

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found. Please log in again.');
      }
      await axios.patch(`${process.env.REACT_NATIVE_BACKEND_URL}/api/users/${route.params?.userId}`, // Use the userId from route parameters
        { username, location, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.message); // Logging the full error message and trace
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        multiline
        numberOfLines={4}
        value={bio}
        onChangeText={setBio}
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileEditScreen;