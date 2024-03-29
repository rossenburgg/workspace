import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';

const useAdjustForBottomTabBarHeight = () => {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get('window').height;

  return screenHeight - bottomTabBarHeight;
};

export default useAdjustForBottomTabBarHeight;