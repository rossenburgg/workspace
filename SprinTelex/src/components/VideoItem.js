import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, Alert } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused to determine if the screen is focused
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '@env';

const { width, height } = Dimensions.get('window');

const VideoItem = ({ video, play, onPlaybackStatusUpdate, shouldLoad, username, profilePictureUrl, caption }) => {
  const liked = useSharedValue(false);
  const isPlaying = useSharedValue(play);
  const likeOpacity = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused(); // Use useIsFocused to check if the ReelsScreen is currently focused

  useEffect(() => {
    isPlaying.value = play && isFocused; // Update to play only if the screen is focused
  }, [play, isFocused]);

  const likeAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(likeOpacity.value, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  const onDoubleTap = () => {
    liked.value = !liked.value;
    likeOpacity.value = 1;
    setTimeout(() => {
      likeOpacity.value = 0;
    }, 1000);
    handleLikePress(); // Call the like function when double tapped
  };

  const onSingleTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      isPlaying.value = !isPlaying.value;
      runOnJS(onPlaybackStatusUpdate)({ isPlaying: isPlaying.value }, video.id);
    }
  };

  const handleLikePress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${REACT_APP_SERVER_URL}/api/reels/interact/like`, 
        { reelId: video.id }, // Assuming video.id is the ID of the reel
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Like status updated for reel:', video.id);
      // Update the UI based on the new like status
      // This may involve setting a new state or refetching reel data
    } catch (error) {
      console.error('Error liking reel:', error);
      Alert.alert('Error', 'Failed to update like status.');
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={onSingleTap} numberOfTaps={1}>
      <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
        <View style={styles.container}>
          {shouldLoad && isFocused ? ( // Conditional rendering based on isFocused
            <Video
              source={{ uri: video.uri }}
              style={[styles.video, { height: height - tabBarHeight - 50, width: width }]} // Adjusted to full screen height excluding bottom navigation and adjusted for tabBarHeight
              resizeMode="cover"
              isLooping
              shouldPlay={isPlaying.value}
              onPlaybackStatusUpdate={(status) => runOnJS(onPlaybackStatusUpdate)(status, video.id)}
              useNativeControls={false}
              onError={(e) => console.error("Video playback error:", e)}
            />
          ) : (
            <Image source={require('../../assets/icon.png')} style={[styles.video, { height: height - tabBarHeight - 50, width: width }]} />
          )}
          <Animated.View style={[styles.likeAnimationContainer, likeAnimationStyle]}>
            <Ionicons name="heart" size={100} color="white" />
          </Animated.View>
          <View style={styles.interactions}>
            <TouchableOpacity onPress={handleLikePress} style={styles.icon}>
              <Ionicons name={liked.value ? 'heart' : 'heart-outline'} size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Commented on video ID:', video.id)} style={styles.icon}>
              <Ionicons name="chatbubble-outline" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Shared video ID:', video.id)} style={styles.icon}>
              <Ionicons name="share-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.userDetails}>
            <Image source={{ uri: profilePictureUrl }} style={styles.profilePic} />
            <View style={styles.textContainer}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.caption}>{caption}</Text>
            </View>
          </View>
        </View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Default background color
  },
  video: {
    width: '100%',
  },
  interactions: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: 10,
  },
  icon: {
    marginVertical: 5,
    padding: 10,
  },
  likeAnimationContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  userDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    color: '#000', // Default text color
  },
  caption: {
    fontStyle: 'italic',
    color: '#000', // Default text color
  },
});

export default VideoItem;