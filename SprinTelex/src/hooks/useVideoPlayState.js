import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useVideoPlayState = (scrollY) => {
  const screenHeight = Dimensions.get('window').height;
  const [activeVideoId, setActiveVideoId] = useState(0);

  useEffect(() => {
    const id = Math.floor(scrollY / screenHeight);
    setActiveVideoId(id);
  }, [scrollY, screenHeight]);

  return activeVideoId;
};

export default useVideoPlayState;