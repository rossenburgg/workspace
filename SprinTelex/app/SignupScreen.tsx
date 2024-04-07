import React, { useState } from 'react';
import { TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for making HTTP requests to the backend
import { View } from '@/components/Themed';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      // Send user information to the backend to save in MongoDB
      await axios.post(`http://192.168.8.130:3000/api/auth/signup`, {
        email: email,
        username: username,
        password: password,
        location: location,
        bio: bio,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log('User registered successfully:', response.data);
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('(tabs)'); // Navigate to the home screen after successful registration
      }).catch(error => {
        console.error('Error signing up:', error);
        console.error(error.message);
        Alert.alert('Error', error.response.data.message || 'Failed to sign up. Please try again.');
      });
    } catch (error) {
      console.error('Error signing up:', error);
      console.error(error.message);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
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
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default SignupScreen;