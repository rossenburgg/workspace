import React from 'react';
import { StyleSheet,  ScrollView, Dimensions } from 'react-native';

import HomeScreenInfo from '@/components/HomeScreenInfo';
import { Text, View } from '@/components/Themed';
import StatusView from '@/components/StatusView';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <StatusView />
      </View>
      <ScrollView style={styles.homeScreenInfoScrollView}>
        <View style={styles.homeScreenInfoContainer}>
          <HomeScreenInfo  />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  storyContainer: {
    height: screenHeight / 8, // Story component takes no more than one-third of the screen height
  },
  homeScreenInfoScrollView: {
    flex: 1, // Allows the ScrollView to take up the remaining space
  },
  homeScreenInfoContainer: {
    // Adjust this style as needed to ensure it displays correctly within the ScrollView
  },
});