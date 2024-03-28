import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { fetchReels, likeReel } from '../services/reelService';

const ReelsScreen = () => {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const loadReels = async () => {
      try {
        const fetchedReels = await fetchReels();
        setReels(fetchedReels);
      } catch (error) {
        console.error('Error during fetching reels:', error.message, error.stack);
      }
    };
    loadReels();
  }, []);

  const handleLike = async (reelId) => {
    try {
      await likeReel(reelId);
      // Refresh reels or update UI accordingly
      const updatedReels = await fetchReels(); // Fetch updated reels list after liking a reel
      setReels(updatedReels);
    } catch (error) {
      console.error('Error liking the reel:', error.message, error.stack);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reelItem}>
            <Video
              source={{ uri: item.videoUrl }}
              style={styles.video}
              resizeMode="cover"
              repeat={true}
              onError={(e) => console.error('Video error:', e)}
            />
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity onPress={() => handleLike(item._id)}>
              <Text style={styles.likeButton}>Like</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reelItem: {
    marginBottom: 20,
  },
  video: {
    height: 200,
    width: '100%',
  },
  description: {
    marginTop: 5,
  },
  likeButton: {
    color: 'blue',
    marginTop: 5,
  },
});

export default ReelsScreen;