import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileHeader = ({ username, profilePictureUrl, followersCount, followingCount }) => {
  const defaultProfilePic = 'https://example.com/default_profile_pic.png'; // Replace with actual default profile picture URL
  return (
    <View style={styles.container}>
      <Image source={{ uri: profilePictureUrl || defaultProfilePic }} style={styles.profilePic} />
      <Text style={styles.username}>{username}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
  },
});

export default ProfileHeader;