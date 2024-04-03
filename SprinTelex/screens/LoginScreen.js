import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleNextPress = () => {
    console.log('Next button pressed');
    navigation.navigate('PasswordInput');
  };

  const handleRegisterPress = () => {
    console.log('Register button pressed');
    // Add navigation logic here
  };

  const handleGoogleSignInPress = () => {
    console.log('Google Sign-In button pressed');
    // Implement Google Sign-In logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SprinTelex</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title="Next"
        onPress={handleNextPress}
        buttonStyle={styles.button}
      />
      <Button
        title="Register"
        type="outline"
        onPress={handleRegisterPress}
        buttonStyle={styles.button}
      />
      <TouchableOpacity style={styles.googleSignInBtn} onPress={handleGoogleSignInPress}>
        <Icon name="google" size={20} color="#DB4437" />
        <Text style={styles.googleSignInText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginVertical: 5,
  },
  googleSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 5,
    padding: 10,
  },
  googleSignInText: {
    marginLeft: 10,
  },
});

export default LoginScreen;