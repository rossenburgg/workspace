import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '@env';
import ProfileHeader from '../components/ProfileHeader';
import { updateLastViewedUserId } from '../utils/userHelpers'; // Import the utility function
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen = ({ route }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const userId = route.params?.userId;
      if (!userId) {
        throw new Error('Missing userId');
      }
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Unauthorized or missing userId');
      }

      const response = await axios.get(`${REACT_APP_SERVER_URL}/api/profile/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      setLoading(false);
      setError(""); // Reset error state in case of successful fetch
      await updateLastViewedUserId(userId); // Update last viewed user ID after successful data fetch
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to fetch user data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={fetchUserData} style={styles.refreshButton}>Refresh</Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchUserData();
  }, [route.params?.userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader
        username={userData.username || 'Username'}
        profilePictureUrl={userData.profilePictureUrl || 'https://via.placeholder.com/150'}
        isVerified={userData.isVerified || false}
        followersCount={userData.followers ? userData.followers.length : 0}
        followingCount={userData.following ? userData.following.length : 0}
        postsCount={userData.posts ? userData.posts.length : 0}
      />
      {/* Render the rest of your component here */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  refreshButton: {
    marginRight: 10,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  // Add more styles as needed
});

export default UserProfileScreen;