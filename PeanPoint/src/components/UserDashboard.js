import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const UserDashboard = () => {
  const { userToken, logout, userDetails } = useContext(AuthContext); // Use userDetails from AuthContext
  const navigation = useNavigation();

  useEffect(() => {
    if (!userToken) {
      console.log('No token found, redirecting to login');
      navigation.navigate('Login');
    }
    // Assuming '/api/user' endpoint exists and returns user data including role
    // Since we're using context, we assume userDetails is part of the global state and fetched upon login
  }, [navigation, userToken]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error.message);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboard}>
        <Text style={styles.header}>User Dashboard</Text>
        {userDetails ? (
          <View>
            <Text style={styles.userInfo}>Welcome, {userDetails.name}</Text>
            {/* Display more user information here */}
          </View>
        ) : (
          <Text>Loading user data...</Text>
        )}
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dashboard: {
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default UserDashboard;