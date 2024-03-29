import React, { useEffect, useState, useLayoutEffect } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Button, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { REACT_APP_SERVER_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader';
import { Icon } from 'react-native-elements';

const UserProfileScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState({});
  const { userId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserPostsAndFollowStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token && userId) {
        try {
          const userResponse = await axios.get(`${REACT_APP_SERVER_URL}/api/profile/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(userResponse.data);

          const postsResponse = await axios.get(`${REACT_APP_SERVER_URL}/api/posts/userPosts?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPosts(postsResponse.data.posts);

          const followStatusResponse = await axios.get(`${REACT_APP_SERVER_URL}/api/follow/isFollowing?targetUserId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFollowing(followStatusResponse.data.isFollowing);
        } catch (error) {
          console.error('Failed to fetch posts or follow status:', error.message, error.stack);
          setLoading(false);
        }
      }
      setLoading(false);
    };

    fetchUserPostsAndFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/api/follow/follow`, { targetUserId: userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
      Alert.alert("Success", "You are now following this user.");
    } catch (error) {
      console.error('Error following user:', error.message, error.stack);
      Alert.alert("Error", "Failed to follow user.");
    }
  };

  const handleUnfollow = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/api/follow/unfollow`, { targetUserId: userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
      Alert.alert("Success", "You have unfollowed this user.");
    } catch (error) {
      console.error('Error unfollowing user:', error.message, error.stack);
      Alert.alert("Error", "Failed to unfollow user.");
    }
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postContainer}>
      <FastImage style={styles.image} source={{ uri: item.imageUrl }} resizeMode={FastImage.resizeMode.cover} />
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const { width } = Dimensions.get('window');
  const imageSize = width / 3; // Adjust the image size based on the screen width

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    followButtonContainer: {
      marginVertical: 10,
    },
    postContainer: {
      width: imageSize,
      height: imageSize,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderText: {
      fontSize: 16,
      color: '#888',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader
        username={userData.username || 'Username'} 
        profilePictureUrl={userData.profilePictureUrl || 'https://via.placeholder.com/150'} 
        isVerified={userData.isVerified || false}
        followersCount={userData.followers ? userData.followers.length : 0}
        followingCount={userData.following ? userData.following.length : 0}
        postsCount={posts.length}
      />
      <View style={styles.followButtonContainer}>
        {isFollowing ? (
          <Button title="Unfollow" onPress={handleUnfollow} />
        ) : (
          <Button title="Follow" onPress={handleFollow} />
        )}
      </View>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          numColumns={3}
        />
      ) : (
        <Text style={styles.placeholderText}>There's no post yet</Text>
      )}
    </SafeAreaView>
  );
};

export default UserProfileScreen;