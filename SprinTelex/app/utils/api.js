import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.8.130:3000/api', 
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header added to the request');
  } else {
    console.log('No user token found in AsyncStorage');
  }
  return config;
}, (error) => {
  console.error('Error in request interceptor:', error);
  console.error('Error details:', error.message, error.stack);
  return Promise.reject(error);
});

export default api;