import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext); // Use signIn function from AuthContext

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/validateToken`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.role === 'admin') {
            navigation.navigate('AdminDashboard');
          } else {
            navigation.navigate('UserDashboard');
          }
        }
      } catch (error) {
        console.error('Error validating token:', error.message);
        console.error(error.stack);
      }
    };
    checkAuthentication();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { username, password });
      console.log('User logged in successfully.');
      await AsyncStorage.setItem('userToken', response.data.token);
      console.log(`Token stored: ${response.data.token}`);
      signIn(response.data.token, response.data.role); // Use signIn from AuthContext instead of direct navigation, passing role for navigation decision
    } catch (error) {
      console.error('Login failed:', error.message);
      console.error(error.stack);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
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

export default LoginScreen;