import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Image, Text, View, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setUsers([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the JWT token from AsyncStorage
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      const response = await axios.get(`http://192.168.8.130:3000/api/search?username=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      console.error(error.message);
      Alert.alert('Error', 'Failed to fetch search results. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('ProfileScreen', { userId: item._id })}>
            <Image source={{ uri: item.profilePictureUrl || 'default_image_url' }} style={styles.profilePic} />
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default SearchScreen;