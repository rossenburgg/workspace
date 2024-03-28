import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const AdminDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingCourts, setPendingCourts] = useState([]);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext); // Use logout function from AuthContext

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Use 'userToken' instead of 'adminToken'
        if (!token) {
          console.log('No token found, redirecting to login');
          navigation.navigate('Login');
          return;
        }
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'; 
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const reviewsResponse = await axios.get(`${backendURL}/api/admin/pending-reviews`, config);
        setPendingReviews(reviewsResponse.data);
        console.log('Pending reviews fetched successfully.');

        const courtsResponse = await axios.get(`${backendURL}/api/admin/pending-courts`, config);
        setPendingCourts(courtsResponse.data);
        console.log('Pending courts fetched successfully.');
      } catch (error) {
        console.error('Fetching admin data failed:', error.message);
        console.error(error.stack);
        alert('Fetching admin data failed. Please try again.');
      }
    };

    fetchAdminData();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logout(); // Use logout from AuthContext
      console.log('Logged out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      console.error(error.stack);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.header}>Pending Reviews</Text>
        {pendingReviews.map(review => (
          <Text key={review._id} style={styles.item}>{review.text}</Text>
        ))}
        <Text style={styles.header}>Pending Courts</Text>
        {pendingCourts.map(court => (
          <Text key={court._id} style={styles.item}>{court.location.coordinates.join(', ')}</Text>
        ))}
        <View style={styles.logoutButton}>
          <Button title="Logout" onPress={handleLogout} color="#007bff" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginVertical: 10,
  },
  item: {
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default AdminDashboard;