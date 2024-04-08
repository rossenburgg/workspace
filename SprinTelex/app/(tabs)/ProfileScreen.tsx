import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, Button } from 'react-native';
import fetchUserProfile from '../utils/fetchUserProfile'; // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setUserProfile(profileData);
        setError('');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch profile data');
        // Error handling for authentication token issues
        if (err.message.includes('Authentication token not found') || err.response?.status === 401) {
          Alert.alert('Unauthorized', 'You are not authorized. Please login again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userProfile ? (
        <View>
          <Text style={styles.profileText}>Username: {userProfile.username}</Text>
          {userProfile.location && <Text style={styles.profileText}>Location: {userProfile.location}</Text>}
          {userProfile.bio && <Text style={styles.profileText}>Bio: {userProfile.bio}</Text>}
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('ProfileEditScreen', {
              username: userProfile.username,
              location: userProfile.location,
              bio: userProfile.bio,
            })}
          />
        </View>
      ) : (
        <Text style={styles.profileText}>No user profile found. Please complete your profile setup.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
  },
  profileText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ProfileScreen;