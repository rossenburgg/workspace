import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Button, ActivityIndicator, Alert, FlatList, TouchableOpacity, Text, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '@/components/ProfileHeader'; // Import the ProfileHeader component

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({ username: '', email: '', profilePictureUrl: '', followers: [], following: [], location: '', bio: '' });
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`http://192.168.8.130:3000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User profile data:', response.data);
      setUserProfile(response.data);
      fetchUserLists(response.data.followers, response.data.following);
      setError('');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.error(error.message);
      if (error.response && error.response.status === 404) {
        setError('No user profile found. Please complete your profile setup.');
      } else {
        setError('Failed to fetch user profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLists = async (followers, following) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const followersResponse = await axios.get(`http://192.168.8.130:3000/api/users/details`, {
        params: { userIds: followers.join(',') },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowersDetails(followersResponse.data);

      const followingResponse = await axios.get(`http://192.168.8.130:3000/api/users/details`, {
        params: { userIds: following.join(',') },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingDetails(followingResponse.data);
    } catch (error) {
      console.error('Error fetching user lists:', error);
      console.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('User signed out successfully');
      navigation.navigate('SigninScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      console.error(error.message);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <>
          <Text style={styles.error}>{error}</Text>
          <Button title="Refresh Profile" onPress={fetchUserProfile} />
        </>
      ) : (
        <>
          <ProfileHeader
            profilePictureUrl={userProfile.profilePictureUrl}
            username={userProfile.username}
            followersCount={followersDetails.length}
            followingCount={followingDetails.length}
          />
          <Text>Location: {userProfile.location}</Text>
          <Text>Bio: {userProfile.bio}</Text>
          <Text style={styles.listTitle}>Followers:</Text>
          <FlatList
            data={followersDetails}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { userId: item._id })}>
                <Image source={{ uri: item.profilePictureUrl || 'default_image_url' }} style={styles.profilePic} />
                <Text>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.listTitle}>Following:</Text>
          <FlatList
            data={followingDetails}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { userId: item._id })}>
                <Image source={{ uri: item.profilePictureUrl || 'default_image_url' }} style={styles.profilePic} />
                <Text>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Edit Profile" onPress={() => console.log('Edit Profile Pressed')} />
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default ProfileScreen;