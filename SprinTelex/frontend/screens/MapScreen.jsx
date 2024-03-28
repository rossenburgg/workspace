import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFriendsLocations } from '../services/friendsService';
import mapboxConfig from '../config/mapboxConfig';
import * as Permissions from 'expo-permissions';
import PropTypes from 'deprecated-react-native-prop-types';

MapboxGL.setAccessToken(mapboxConfig.MAPBOX_ACCESS_TOKEN);

const MapScreen = () => {
  const [friendsLocations, setFriendsLocations] = useState([]);

  useEffect(() => {
    const getFriendsLocations = async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.error('Location permission not granted');
        Alert.alert('Permission Denied', 'This app needs location permissions to work correctly.');
        return;
      }

      try {
        const token = await AsyncStorage.getItem('token');
        const locations = await fetchFriendsLocations(token);
        setFriendsLocations(locations);
      } catch (error) {
        console.error('Error fetching friends locations:', error);
        Alert.alert('Error', 'Failed to fetch friends locations');
      }
    };

    getFriendsLocations();
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} onDidFailLoadingMap={(e) => console.error('Map failed to load:', e)}>
        <MapboxGL.Camera zoomLevel={10} centerCoordinate={[0, 0]} />
        {friendsLocations.map((location, index) => (
          <MapboxGL.PointAnnotation
            key={index}
            id={String(index)}
            coordinate={[location.longitude, location.latitude]}
          >
            <View style={styles.annotationContainer}>
              <Text>{location.name}</Text> {/* Assuming location object has a name property */}
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  annotationContainer: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
});

export default MapScreen;