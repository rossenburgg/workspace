import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Button, ActivityIndicator, Alert, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '@/components/ProfileHeader';
import axios from 'axios'; // Ensure axios is imported for making HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({ username: '', email: '', profilePictureUrl: '', followers: [], following: [], location: '', bio: '' });
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User profile data:', response.data);
      setUserProfile(response.data);
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
            followersCount={userProfile.followers.length}
            followingCount={userProfile.following.length}
          />
          <Text>Location: {userProfile.location}</Text>
          <Text>Bio: {userProfile.bio}</Text>
          <Button title="Edit Profile" onPress={() => navigation.navigate('ProfileEditScreen')} />
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
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;