import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadReel } from '../services/reelService';
import { Ionicons } from '@expo/vector-icons';

const UploadReelScreen = ({ setIsUploadModalVisible }) => {
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.cancelled) {
      setVideo(result.uri);
    }
  };

  const handleUploadReel = async () => {
    if (!video) {
      Alert.alert('Upload failed', 'Please select a video first');
      return;
    }

    try {
      const response = await uploadReel(video, description);
      Alert.alert('Upload successful', 'Your reel has been uploaded');
      setIsUploadModalVisible(false); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading reel:', error.message, error.stack);
      Alert.alert('Upload failed', 'Failed to upload your reel');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsUploadModalVisible(false)}
        style={styles.closeButton}
      >
        <Ionicons name="ios-close" size={30} color="black" />
      </TouchableOpacity>
      <Button title="Pick a video from camera roll" onPress={pickVideo} />
      {video && <Text style={{ margin: 10 }}>Video: {video}</Text>}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Upload Reel" onPress={handleUploadReel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default UploadReelScreen;