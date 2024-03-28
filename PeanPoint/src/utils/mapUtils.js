import axios from 'axios';
import { Alert } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '@env'; // Import API key from environment variables

const fetchRoute = async (origin, destination) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`);
    console.log('Route fetched successfully from Google Maps Directions API');
    if (response.data.status === 'OK') {
      const points = decodePolyline(response.data.routes[0].overview_polyline.points);
      const route = points.map(point => ({ latitude: point[0], longitude: point[1] }));
      return route;
    } else {
      console.error('Failed to fetch route:', response.data.error_message);
      Alert.alert('Error', 'Failed to fetch route. Please try again later.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching route:', error.message, error.stack);
    Alert.alert('Error', 'An error occurred while fetching the route. Please check your network connection and try again.');
    return null;
  }
};

// Function to decode polyline returned by Google Maps Directions API
function decodePolyline(encoded) {
  let poly = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5]);
  }

  return poly;
}

export { fetchRoute };