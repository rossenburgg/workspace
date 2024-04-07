import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Button, ActivityIndicator, Alert, Text, View } from 'react-native';
import api from '../utils/api'; // Adjust the import path as per your project structure
import ProfileHeader from '@/components/ProfileHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      console.error(error.message);
      setError('Failed to fetch user profile. Please try again later.');
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

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Try Again" onPress={fetchUserProfile} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});