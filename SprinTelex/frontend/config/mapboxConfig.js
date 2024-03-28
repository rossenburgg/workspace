import MapboxGL from '@react-native-mapbox-gl/maps';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoicm9zc2VuYnVyZyIsImEi0iJjbHvhMnlkZjcwZGVvMm5xa2JmajA2dDBpIn0.hz69-ALgRIbixxVm8Zatxg';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default {
  MAPBOX_ACCESS_TOKEN,
};