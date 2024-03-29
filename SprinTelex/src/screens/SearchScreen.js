import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_SERVER_URL } from '@env';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`${REACT_APP_SERVER_URL}/api/users/search?query=${searchQuery}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data.users);
        } catch (error) {
          console.error('Error fetching users:', error.message, error.stack);
        } finally {
          setLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserProfileScreen', { userId: item._id })}
    >
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>No users found.</Text>}
        />
      )}
    </SafeAreaView>
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
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 18,
  },
});

export default SearchScreen;