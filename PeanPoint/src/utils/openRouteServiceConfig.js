import axios from 'axios';
import { Alert } from 'react-native';

const ORS_API_KEY = '5b3ce3597851110001cf6248b05504a693754421841b5850576195f4';

const fetchRoute = async (origin, destination) => {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;

  try {
    const response = await axios.get(url);
    console.log('Route fetched successfully from OpenRouteService API');

    const { features } = response.data;
    if (features && features.length > 0) {
      const route = features[0].geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      return route;
    } else {
      console.error('No route found:', response.data);
      Alert.alert('Error', 'No route found. Please try again later.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching route from OpenRouteService API:', error.message, error.stack);
    Alert.alert('Error', 'An error occurred while fetching the route. Please check your network connection and try again.');
    return null;
  }
};

export { fetchRoute };