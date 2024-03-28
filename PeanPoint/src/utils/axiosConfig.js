import axios from 'axios';
import axiosRetry from 'axios-retry'; // Importing axios-retry for implementing retry logic
import { Platform, Alert } from 'react-native';

// Determine the server URL based on the platform and development environment
let serverURL;
if (__DEV__) {
  serverURL = Platform.OS === 'android' ? 'http://192.168.8.130:3000' : 'http://192.168.8.130:3000'; 
} else {
  serverURL = 'https://peanpoint.vfbrzry.mongodb.net'; 
}

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: serverURL, // Use the determined server URL
  timeout: 10000,
});

// Applying retry logic with exponential backoff
axiosRetry(axiosInstance, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log('Sending request to server:', config.url);
    return config;
  }, function (error) {
    // Do something with request error
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    console.log('Response received from server:', response.config.url);
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('Response error:', error);
    Alert.alert('Error', `An error occurred: ${error.response ? error.response.data.error : 'Server error'}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;