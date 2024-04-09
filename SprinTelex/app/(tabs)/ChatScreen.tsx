import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
const ChatScreen = () => {


  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  messageList: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ChatScreen;