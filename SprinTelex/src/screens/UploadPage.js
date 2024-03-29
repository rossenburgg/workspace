import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_SERVER_URL } from '@env';

const UploadPage = () => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Unauthorized', 'You must be logged in to upload reels.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      }
    };
    verifyToken();
  }, [navigation]);

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

  const uploadVideo = async () => {
    if (!video || !caption) {
      Alert.alert("Error", "Both video and caption are required for upload");
      return;
    }

    const formData = new FormData();
    formData.append('video', {
      uri: video,
      type: 'video/mp4',
      name: 'upload.mp4',
    });
    formData.append('caption', caption);

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${REACT_APP_SERVER_URL}/api/reels/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert("Success", "Video uploaded successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", `Failed to upload video: ${data.message}`);
      }
    } catch (error) {
      console.error("Upload Failed", `Error: ${error.message}`, error.stack);
      Alert.alert("Upload Failed", `Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Reel</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Pick a video from gallery</Text>
      </TouchableOpacity>
      {uploading ? (
        <Text>Uploading...</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={uploadVideo}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default UploadPage;