import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is created and exported from context/AuthContext.js
import { CommonActions, useNavigation } from '@react-navigation/native';

const ProfileSettingsScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const { setToken: updateTokenContext, token } = useContext(AuthContext); // Using useContext to access and update the token
  const navigation = useNavigation();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const response = await axios.get('http://192.168.8.130:8080/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { username, email, profilePictureUrl } = response.data;
        setUsername(username);
        setEmail(email);
        setProfilePictureUrl(profilePictureUrl);
      } catch (e) {
        console.error('Failed to fetch profile:', e.message, e.stack);
        Alert.alert('Failed to fetch profile');
      }
    };

    bootstrapAsync();
  }, [token]);

  const handleUpdate = async () => {
    try {
      await axios.put('http://192.168.8.130:8080/api/profile', {
        username,
        email,
        password: password !== '' ? password : undefined,
        profilePictureUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Profile Updated Successfully');
    } catch (e) {
      console.error('Update Failed:', e.message, e.stack);
      Alert.alert('Update Failed', e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      updateTokenContext(null); // Update the context to reflect the logout
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }], // Navigate back to the initial route of AuthStack to ensure a clean state
        })
      );
    } catch (e) {
      console.error('Logout Failed:', e.message, e.stack);
      Alert.alert('Logout Failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Settings</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password (leave blank to keep the same)" secureTextEntry />
      <TextInput style={styles.input} value={profilePictureUrl} onChangeText={setProfilePictureUrl} placeholder="Profile Picture URL" />
      <Button title="Update Profile" onPress={handleUpdate} />
      <Button title="Logout" onPress={handleLogout} color="red" />
      <Button title="Back to Profile" onPress={() => navigation.goBack()} color="#2196F3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileSettingsScreen;