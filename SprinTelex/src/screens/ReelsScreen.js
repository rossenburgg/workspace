import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, SafeAreaView, StyleSheet, Alert } from 'react-native';
import VideoItem from '../components/VideoItem';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReelsScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found, unauthorized access attempt.');
          Alert.alert('Error', 'You must be logged in to view reels.');
          return;
        }
        const response = await axios.get('http://192.168.8.130:8080/api/reels/feed', { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(response.data.reels);
      } catch (error) {
        console.error('Error fetching reels:', error.message, error.stack);
        Alert.alert('Error', 'Failed to fetch reels. Please try again later.');
      }
    };

    fetchReels();
  }, []);

  const renderItem = ({ item }) => (
    <VideoItem
      video={item}
      play={item.shouldPlay}
      shouldLoad={item.shouldPlay}
      username={item.uploader.username} // Assuming the API response includes these details
      profilePictureUrl={item.uploader.profilePictureUrl}
      caption={item.caption}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ReelsScreen;