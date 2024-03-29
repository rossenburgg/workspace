import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { REACT_APP_SERVER_URL } from '@env';

const ProfileHeader = ({ username, profilePictureUrl, isVerified, followersCount, followingCount, postsCount }) => {
  const { width } = Dimensions.get('window');

  const updateProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    const uploadUrl = `${REACT_APP_SERVER_URL}/api/profile/updateProfilePicture`;
    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('profilePicture', {
      uri: pickerResult.uri,
      name: 'profilePicture.jpg',
      type: 'image/jpg',
    });

    try {
      const response = await axios.put(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile picture updated successfully.');
      } else {
        throw new Error('Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error.message, error.stack);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    profilePic: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: (width * 0.2) / 2,
      marginRight: 20,
    },
    userInfo: {
      flex: 1,
    },
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontWeight: 'bold',
      fontSize: width * 0.05,
      marginRight: 5,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    statsText: {
      fontSize: width * 0.04,
    },
    statsNumber: {
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={updateProfilePicture}>
        <Image source={{ uri: profilePictureUrl || 'https://via.placeholder.com/150' }} style={styles.profilePic} />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{username}</Text>
          {isVerified && <Icon name='check-circle' type='material' color='#4b7bec' size={18} />}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}><Text style={styles.statsNumber}>{postsCount}</Text> posts</Text>
          <Text style={styles.statsText}><Text style={styles.statsNumber}>{followersCount}</Text> followers</Text>
          <Text style={styles.statsText}><Text style={styles.statsNumber}>{followingCount}</Text> following</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;