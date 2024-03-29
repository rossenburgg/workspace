import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const initChat = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Unauthorized', 'You must be logged in to access the chat.');
        navigation.navigate('Login');
        return;
      }

      // Placeholder for initializing chat client and fetching messages
      // Assuming the logic to fetch messages will be implemented here
      const fetchedMessages = []; // Placeholder for fetched messages
      setMessages(fetchedMessages);
    };

    initChat();
  }, [navigation]);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    // Placeholder for sending a message logic
    console.log('Sending message:', newMessages[0].text); // Log the message being sent
    // Assuming the logic to send messages will be implemented here
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('userID');
      return userId;
    };

    getUserId().then((userId) => {
      if (!userId) {
        Alert.alert('Error', 'Failed to retrieve user ID.');
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: AsyncStorage.getItem('userID'), // This needs to be replaced with a state that holds the user ID
        }}
        showUserAvatar={true}
        alwaysShowSend={true}
        scrollToBottom
        renderUsernameOnMessage
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;