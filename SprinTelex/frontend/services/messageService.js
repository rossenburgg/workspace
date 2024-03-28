import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.8.130:3001/api/message'; 

export const fetchMessages = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/conversation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during fetching messages:', error.message, error.stack);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during sending message:', error.message, error.stack);
    throw error;
  }
};