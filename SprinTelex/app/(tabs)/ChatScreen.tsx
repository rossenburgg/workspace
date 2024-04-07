import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import MessageBubble from '@/components/MessageBubble'; // Make sure this component exists and is correctly implemented

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const chatId = route.params?.chatId; // Assuming chatId is passed as a parameter to this screen

  // Function to fetch chat history
  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://192.168.8.130:3000/api/chats/${chatId}/messages`);
      setMessages(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      Alert.alert('Error', 'Failed to fetch chat history.');
      setIsLoading(false);
    }
  };

  // Function to send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`http://192.168.8.130:3000/api/chats/${chatId}/messages`, { content: newMessage });
      setNewMessage('');
      fetchChatHistory(); // Refresh chat history after sending a message
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [chatId]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        style={styles.messageList}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={handleSendMessage} />
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