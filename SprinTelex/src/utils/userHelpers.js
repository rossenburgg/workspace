import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateLastViewedUserId = async (userId) => {
  try {
    await AsyncStorage.setItem('lastViewedUserId', userId);
    console.log('Last viewed user ID updated successfully:', userId);
  } catch (error) {
    console.error('Error updating last viewed user ID in AsyncStorage:', error.message, error.stack);
  }
};