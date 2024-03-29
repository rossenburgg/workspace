import React, { forwardRef, useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_SERVER_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const UploadModal = forwardRef((props, ref) => {
  const [caption, setCaption] = useState('');
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
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
      console.log('Video picked for upload:', result.uri); // Logging video selection
      setVideo(result.uri);
    }
  };

  const uploadVideo = async () => {
    if (!video || !caption) {
      Alert.alert("Error", "Both video and caption are required for upload");
      return;
    }

    setUploading(true);
    console.log('Uploading video...'); // Logging upload start

    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('video', { uri: video, type: 'video/mp4', name: 'upload.mp4' });
    formData.append('caption', caption);

    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/api/reels/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload video");
      }

      console.log('Video uploaded successfully:', data); // Logging success
      Alert.alert("Success", "Video uploaded successfully");
      setCaption('');
      setVideo(null);
      ref.current?.dismiss(); // Changed from close to dismiss to correctly use BottomSheetModal method
    } catch (error) {
      console.error("Upload Failed", `Error: ${error.message}`, error.stack); // Logging the entire error
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <BottomSheetModalProvider>
    <View style={styles.container}>
   

      <BottomSheetModal
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {
          console.log('Upload modal closed'); // Logging modal close
          setCaption('');
          setVideo(null);
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Upload a Video</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a caption"
            value={caption}
            onChangeText={setCaption}
          />
          <Button title="Pick a video" onPress={pickVideo} />
          {uploading ? (
            <Text>Uploading...</Text>
          ) : (
            <Button title="Upload" onPress={uploadVideo} />
          )}
        </View>
      </BottomSheetModal>


    </View>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
    borderRadius: 10,
  },
});

export default UploadModal;