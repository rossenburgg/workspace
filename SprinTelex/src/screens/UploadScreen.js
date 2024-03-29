import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Button, Alert, View } from 'react-native'; // Import SafeAreaView
import UploadModal from '../components/UploadModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef(null);
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

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
        <Button title="Upload Reel" onPress={handleOpenModal} />
        {isModalVisible && <UploadModal ref={modalRef} onClose={handleCloseModal} />}
      </View>
    </SafeAreaView>
  );
};

export default UploadScreen;