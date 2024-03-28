import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [username, setp] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      // Assuming the role is always 'user' for new signups, as admin accounts are likely created differently.
      const response = await axios.post(`http://192.168.8.130:3000/api/register`, { username, password, role: 'user' }); 
      console.log('User signed up successfully.');
      Alert.alert('Success', 'Account created successfully. Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup failed:', error.message);
      console.error(error.stack);
      Alert.alert('Signup failed', 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignup} />
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
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default SignupScreen;