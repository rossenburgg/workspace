import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const PasswordInputScreen = () => {
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLoginPress = () => {
    console.log('Login button pressed');
    // Add login logic here
    // Remember to handle errors and log them appropriately
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Login"
        onPress={handleLoginPress}
        buttonStyle={styles.button}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
        <Text style={styles.backLinkText}>Change Email</Text>
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
  backLink: {
    marginTop: 15,
  },
  backLinkText: {
    color: '#007bff',
  },
});

export default PasswordInputScreen;