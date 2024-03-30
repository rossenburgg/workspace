import React, { forwardRef, useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { uploadVideo, saveVideoMetadata } from '../services/firebaseService'; // Import the uploadVideo and saveVideoMetadata functions

const UploadModal = forwardRef((props, ref) => {
  const [caption, setCaption] = useState('');
  const [videoUri, setVideoUri] = useState(null);
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
      setVideoUri(result.uri);
    }
  };

  const handleUpload = async () => {
    if (!videoUri || !caption) {
      Alert.alert("Error", "Both video and caption are required for upload");
      return;
    }

    setUploading(true);
    console.log('Uploading video...'); // Logging upload start

    const { success, url, error } = await uploadVideo(videoUri);

    if (success) {
      console.log('Video uploaded successfully:', url); // Logging success
      const uploaderId = await AsyncStorage.getItem('userId'); // INPUT_REQUIRED {userId} - Ensure this is set during user authentication
      const metadata = {
        videoUrl: url,
        caption: caption,
        uploaderId: uploaderId,
      };

      const saveMetadataResponse = await saveVideoMetadata(metadata);

      if (saveMetadataResponse.success) {
        console.log('Video metadata saved successfully');
        Alert.alert("Success", "Video uploaded successfully");
      } else {
        console.error("Metadata Save Failed", `Error: ${saveMetadataResponse.error}`);
        Alert.alert("Upload Failed", saveMetadataResponse.error);
      }

      setCaption('');
      setVideoUri(null);
      ref.current?.dismiss(); // Changed from close to dismiss to correctly use BottomSheetModal method
    } else {
      console.error("Upload Failed", `Error: ${error}`, error.stack); // Adjusted error logging
      Alert.alert("Upload Failed", error);
    }
    setUploading(false);
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <BottomSheetModal
          ref={ref}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => {
            console.log('Upload modal closed'); // Logging modal close
            setCaption('');
            setVideoUri(null);
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
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Upload" onPress={handleUpload} />
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
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default UploadModal;