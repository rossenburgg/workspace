import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Replacing jwtDecode with axios for API calls

const checkTokenValidity = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('No user token found in AsyncStorage');
      return false;
    }
    // Making an API call to validate the token
    const response = await axios.post('http://192.168.8.130:3000/api/auth/validateToken', { token }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.data.isValid) {
      console.log('User token found in AsyncStorage and is valid');
      return true;
    } else {
      console.log('Token has expired or is invalid');
      return false;
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    console.error(error.message);
    return false;
  }
};

export { checkTokenValidity };