import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message }) => {
  return (
    <View style={styles.bubble}>
      <Text>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default MessageBubble;