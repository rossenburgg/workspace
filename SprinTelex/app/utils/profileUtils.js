import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('Token not found in AsyncStorage. Please log in again.');
      throw new Error('Token not found. Please log in again.');
    }
    const response = await axios.get(`http://192.168.8.130:3000/api/users/profile`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 && response.data) {
      console.log('User profile data fetched successfully:', response.data);
      return { success: true, data: response.data };
    } else {
      console.log('No user profile found. Please complete your profile setup.');
      throw new Error('No user profile found. Please complete your profile setup.');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error('Error details:', error.message, error.stack);
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access detected. Please log in again.');
      throw new Error('Unauthorized access. Please log in again.');
    } else if (error.response && error.response.status === 404) {
      console.log('No user profile found. Please complete your profile setup.');
      throw new Error('No user profile found. Please complete your profile setup.');
    } else {
      console.log('Failed to fetch user profile. Please try again later.');
      throw new Error('Failed to fetch user profile. Please try again later.');
    }
  }
};