import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_BACKEND_URL } from '@env'; // Import backend URL from environment variables

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${REACT_NATIVE_BACKEND_URL}/api/auth/signin`, { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        console.log('User signed in successfully:', response.data.userId);
        navigation.navigate('(tabs)'); // Navigate to the home screen upon successful sign-in
      } else {
        throw new Error('Sign-in failed, no token received.');
      }
    } catch (error) {
      console.error('Error signing in user:', error);
      console.error('Error details:', error.message, error.stack);
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignupScreen')} />
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
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default SigninScreen;