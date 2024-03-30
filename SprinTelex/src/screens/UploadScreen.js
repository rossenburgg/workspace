import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Button, Alert, View, ActivityIndicator } from 'react-native'; // Import SafeAreaView
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = () => {
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

  const handleUpload = async () => {
    setUploading(true);
    console.log("Starting upload simulation");
    // Simulate a network request delay
    setTimeout(() => {
      setUploading(false);
      console.log("Upload simulation completed");
      Alert.alert('Upload Status', 'Upload simulated successfully!');
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {uploading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Upload Reel" onPress={handleUpload} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UploadScreen;