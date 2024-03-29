import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChannelListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Channel listing feature is not available in this version.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default ChannelListScreen;