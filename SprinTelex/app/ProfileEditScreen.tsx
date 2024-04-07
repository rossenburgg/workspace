import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Use axios for HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing the JWT token

const ProfileEditScreen = () => {
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const navigation = useNavigation();

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the JWT token from AsyncStorage
      if (!token) {
        throw new Error('User token not found. Please log in again.');
      }
      await axios.patch(`http://<YOUR_BACKEND_URL>/api/users/profile`, // Replace <YOUR_BACKEND_URL> with the actual backend URL
        { location, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Profile update request sent', { location, bio }); // Logging the profile update request
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