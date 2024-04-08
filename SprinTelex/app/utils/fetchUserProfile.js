import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('No user token found');
      throw new Error('Authentication token not found');
    }
    const response = await axios.get('http://192.168.8.130:3000/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User profile fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error(error.message);
    console.error(error.stack);
    throw error;
  }
};

export default fetchUserProfile;