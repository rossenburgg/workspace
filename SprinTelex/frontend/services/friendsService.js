import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.8.130:3001/api/friends'; 

export const fetchFriendsLocations = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    const response = await fetch(`${API_URL}/locations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch friends locations');
    }
    const data = await response.json();
    console.log('Friends locations fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error during fetching friends locations:', error.message, error.stack);
    throw error;
  }
};