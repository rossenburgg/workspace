import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, Text, Alert } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import VideoItem from '../components/VideoItem';
import useVideoPlayState from '../hooks/useVideoPlayState';
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReelsScreen = () => {
  const flatListRef = useRef();
  const [viewableItems, setViewableItems] = useState([]);
  const [videos, setVideos] = useState([]); // State to hold videos fetched from backend
  const activeVideoId = useVideoPlayState(viewableItems);
  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('No token found, unauthorized access attempt.');
          Alert.alert('Unauthorized', 'You must be logged in to view videos.');
          return;
        }
        const response = await axios.get(`${REACT_APP_SERVER_URL}/api/reels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.videos)) {
          setVideos(response.data.videos.map(video => ({
            ...video,
            id: video._id, // Ensure each video item has an 'id' field for the FlatList keyExtractor
          })));
        } else {
          console.error('Error fetching videos: Invalid response format');
          Alert.alert('Error', 'Failed to fetch videos. Please check the server response format.');
        }
      } catch (error) {
        console.error('Error fetching videos:', error.message, error.stack);
        Alert.alert('Error', 'Failed to fetch videos. Please try again later.');
      }
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item, index }) => (
    <VideoItem
      video={item}
      play={index === activeVideoId}
      shouldLoad={viewableItems.includes(item.id)} // Dynamically set based on onViewableItemsChanged logic
      onPlaybackStatusUpdate={(status, id) => console.log(`Playback status updated for video ${id}:`, status)}
      username={item.uploader.username} // Assuming the video item includes uploader details
      profilePictureUrl={item.uploader.profilePictureUrl} // Assuming the video item includes uploader details
      caption={item.caption} // Assuming the video item includes a caption
    />
  );

  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log("Viewable items:", viewableItems.map(item => item.key));
    setViewableItems(viewableItems.map(item => item.key));
  };

  return (
    <View style={{ flex: 1 }}>
      {videos.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()} // Ensure keyExtractor uses string IDs
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50 // Considered viewable if 50% or more is visible
          }}
          getItemLayout={(data, index) => (
            {length: screenHeight - tabBarHeight, offset: (screenHeight - tabBarHeight) * index, index}
          )}
        />
      ) : (
        <Text>No videos to display</Text> // Provide feedback when there are no videos
      )}
    </View>
  );
};

export default ReelsScreen;