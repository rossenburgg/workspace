import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, Alert, FlatList, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '@env';
import ProfileHeader from '../components/ProfileHeader';
import ProfileHeaderBar from '../components/ProfileHeaderBar';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found, unauthorized access attempt.');
          navigation.navigate('Login');
          return;
        }
        const response = await axios.get(`${REACT_APP_SERVER_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.message, error.stack);
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error.message, error.stack);
      Alert.alert('Logout Failed', 'An error occurred while trying to log out.');
    }
  };

  const defaultProfilePicUrl = 'https://example.com/default_profile_pic.png';

  const renderPost = ({ item, index }) => (
    <View style={styles.postContainer}>
      <Text>Post {index + 1}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileHeaderBar />
      <ScrollView style={styles.container}>
        <ProfileHeader
          username={userData.username || ''}
          profilePictureUrl={userData.profilePictureUrl || defaultProfilePicUrl}
          isVerified={userData.isVerified || false}
          followersCount={userData.followers ? userData.followers.length : 0}
          followingCount={userData.following ? userData.following.length : 0}
          postsCount={userData.posts ? userData.posts.length : 0}
        />
        {userData.posts && userData.posts.length > 0 ? (
          <FlatList
            data={userData.posts}
            renderItem={renderPost}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={styles.noPostsText}>There's no post yet</Text>
        )}
        <View style={styles.logoutButtonContainer}>
          <Button title="Logout" onPress={handleLogout} color="#2196F3" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  postContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;