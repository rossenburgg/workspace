import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.8.130:3001/api/reel';

export const fetchReels = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reels');
    }
    console.log('Reels fetched successfully.');
    return await response.json();
  } catch (error) {
    console.error('Error during fetching reels:', error.message, error.stack);
    throw error;
  }
};

export const likeReel = async (reelId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/like/${reelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to like reel');
    }
    console.log(`Reel ${reelId} liked successfully.`);
    return await response.json();
  } catch (error) {
    console.error('Error during liking reel:', error.message, error.stack);
    throw error;
  }
};

export const uploadReel = async (videoUri, description) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4', // Assuming the video is in mp4 format
      name: 'reel.mp4',
    });
    formData.append('description', description);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload reel');
    }
    console.log('Reel uploaded successfully.');
    return await response.json();
  } catch (error) {
    console.error('Error during reel upload:', error.message, error.stack);
    throw error;
  }
};