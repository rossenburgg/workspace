import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('adminToken');
        if (token) {
          const response = await axios.get('http://192.168.8.130:3000/api/validateToken', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.role === 'admin') {
            navigation.navigate('AdminDashboard');
          } else {
            Alert.alert('Access Denied', 'You are not authorized to access this page.');
            await AsyncStorage.removeItem('adminToken');
            navigation.navigate('Login');
          }
        }
      } catch (error) {
        console.error('Error validating token:', error.message);
        console.error(error.stack);
        Alert.alert('Session Expired', 'Please login again.');
        navigation.navigate('Login');
      }
    };
    checkAuthentication();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.8.130:3000/api/login', { username, password }); // INPUT_REQUIRED {backend_url}
      console.log('Admin logged in successfully.');
      await AsyncStorage.setItem('adminToken', response.data.token);
      console.log('Admin token stored successfully.');
      if (response.data.role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else {
        Alert.alert('Access Denied', 'You are not authorized to access this page.');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      console.error(error.stack);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Admin Login</Text>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
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

export default AdminScreen;