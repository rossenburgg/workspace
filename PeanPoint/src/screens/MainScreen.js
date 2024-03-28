import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Image, Text, Platform, ActivityIndicator, TouchableOpacity, Easing, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Carousel from 'react-native-snap-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axiosInstance from '../utils/axiosConfig'; // Importing the axios instance
import axiosRetry from 'axios-retry'; // Importing axios-retry for implementing retry logic
import colorPalette from '../config/colorPalette'; // Importing the color palette
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { fetchRoute } from '../utils/openRouteServiceConfig'; // Importing fetchRoute from openRouteServiceConfig
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

axiosRetry(axiosInstance, { retries: 3, retryDelay: axiosRetry.exponentialDelay }); // Applying retry logic with exponential backoff

function MainScreen() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [courts, setCourts] = useState([]);
  const [selectedCourtDetails, setSelectedCourtDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          return;
        }

        let locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 1000 },
          async (locationUpdate) => {
            setLocation(locationUpdate.coords);
            setHeading(locationUpdate.coords.heading);
            if (locationUpdate.coords) {
              console.log(`Requesting nearby courts with latitude: ${locationUpdate.coords.latitude} and longitude: ${locationUpdate.coords.longitude}`);
              axiosInstance.get(`/api/courts?latitude=${locationUpdate.coords.latitude}&longitude=${locationUpdate.coords.longitude}`, { timeout: 10000 }) // 10 seconds timeout
                .then(response => {
                  const data = response.data;
                  console.log('Nearby courts fetched:', data);
                  setCourts(data);
                })
                .catch(error => {
                  console.error('Error fetching courts:', error.response ? error.response.data.error : error.message, error.stack);
                  Alert.alert('Error', `An error occurred while fetching courts: ${error.response ? error.response.data.error : 'Server error'}. Please check your network connection and try again.`);
                });
            }
          }
        );

        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (error) {
        console.error('Error fetching location permissions:', error.message, error.stack);
        Alert.alert('Error', 'An error occurred while fetching location permissions. Please try again.');
      }
    })();
  }, []);

  const fetchCourtDetails = useCallback((courtId) => {
    setSelectedCourtId(courtId); // Set the selected court ID for retry
    setIsFetching(true);
    axiosInstance.get(`/api/courts/${courtId}`)
      .then(response => {
        const data = response.data;
        setSelectedCourtDetails(data);
        setError(null); // Clear any existing errors
        bottomSheetRef.current?.expand();
      })
      .catch(error => {
        console.error('Error fetching court details:', error.message, error.stack);
        setError('Failed to load court details. Please try again later.'); // Set error state
        setSelectedCourtDetails(null); // Clear any existing court details
      })
      .finally(() => setIsFetching(false));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
      </View>
    );
  };

  const navigateToCourt = (latitude, longitude) => {
    fetchRoute({ latitude: location.latitude, longitude: location.longitude }, { latitude, longitude })
      .then(route => {
        setRouteCoordinates(route);
      })
      .catch(error => {
        console.error('Error fetching route:', error.message, error.stack);
        Alert.alert('Error', 'Failed to fetch route. Please try again later.');
      });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {courts.map((court) => (
              <Marker
                key={court._id}
                coordinate={{ latitude: court.location.coordinates[1], longitude: court.location.coordinates[0] }}
                title={`Court ID: ${court._id}`}
                image={require('../../assets/favicon.png')}
                onPress={() => {
                  console.log(`Court marker pressed. Court ID: ${court._id}`);
                  fetchCourtDetails(court._id);
                }}
              />
            ))}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeWidth={6}
              />
            )}
          </MapView>
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={[450, 350, 300]}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
          animationConfig={{
            easing: Easing.out(Easing.cubic),
            duration: 500
          }}
          onChange={(index) => {
            console.log(`Bottom sheet state changed. New index: ${index}`);
            if (index === -1) {
              setSelectedCourtDetails(null);
              setRouteCoordinates([]); // Reset routeCoordinates when bottom sheet is closed
            }
          }}
        >
          {isFetching && <ActivityIndicator size="large" color={colorPalette.primary} />}
          {error && (
            <View style={styles.bottomSheetContent}>
              <Text>{error}</Text>
              <Button title="Retry" onPress={() => fetchCourtDetails(selectedCourtId)} color={colorPalette.primary} />
            </View>
          )}
          {!isFetching && !error && selectedCourtDetails && (
            <View style={styles.bottomSheetContent}>
                      <Button title="Admin Login" onPress={() => navigation.navigate('Admin')} />

              <Carousel
                data={selectedCourtDetails.picturesUrls}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width}
                layout={'default'}
              />
              <TouchableOpacity onPress={() => navigateToCourt(selectedCourtDetails.location.coordinates[1], selectedCourtDetails.location.coordinates[0])} style={{ marginTop: 20 }}>
                <FontAwesomeIcon icon={faRoute} size={24} color={colorPalette.primary} />
              </TouchableOpacity>
              {selectedCourtDetails.reviews.map((review, index) => (
                <View key={index} style={styles.reviewContainer}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  reviewContainer: {
    padding: 10,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    color: colorPalette.text,
  },
  reviewText: {
    marginTop: 5,
    color: colorPalette.text,
  },
});

export default MainScreen;