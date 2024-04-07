import React, { useState, useEffect, useRef } from 'react';
import {FlatList, StyleSheet, Dimensions,  Platform } from 'react-native';
import ReelItem from '../ReelItem'; // Adjust this import path if ReelItem is located elsewhere
import reelsData from '../assets/reelsData.json'; // Adjust this import path to the actual location of reelsData.json
import { Text, View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
const ReelsScreen = () => {
  const [reels, setReels] = useState([]);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50 // Adjust this value as needed
  });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setReels(reels.map((reel, index) => ({
      ...reel,
      isVisible: viewableItems.some(item => item.index === index)
    })));
  });

  useEffect(() => {
    // Simulating fetch from local JSON file
    setReels(reelsData.map(reel => ({ ...reel, isVisible: false }))); // Initialize all reels as not visible
  }, []);

  return (
    <View style={styles.container}>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <FlatList
        data={reels}
        renderItem={({ item }) => (
          <ReelItem 
            videoUrl={item.videoUrl} 
            author={item.author} 
            description={item.description}
            isVisible={item.isVisible} // Pass isVisible prop to ReelItem
          />
        )}
        keyExtractor={item => item.key}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToAlignment={"start"}
        snapToInterval={Dimensions.get('window').height}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed background color to black as per user feedback
  },
});

export default ReelsScreen;
