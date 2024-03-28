import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { sendMessage, fetchMessages } from '../services/messageService';

const socket = io('http://192.168.8.130:3002');

const ChatScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages().then(setMessages)
    .catch(error => console.error('Error fetching messages:', error.message, error.stack));

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket.off('message');
  }, []);

  const handleSend = () => {
    const messageData = { content: message, sender: 'UserID', receiver: 'OtherUserID' }; // Update with actual user IDs
    sendMessage(messageData).then(() => {
      setMessage('');
      socket.emit('send', messageData);
    }).catch(error => console.error('Error sending message:', error.message, error.stack));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
      <TextInput 
        value={message} 
        onChangeText={setMessage} 
        style={styles.input}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ChatScreen;