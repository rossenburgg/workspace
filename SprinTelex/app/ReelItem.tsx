import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Text, View } from '@/components/Themed';

interface ReelItemProps {
  videoUrl: string;
  author: string;
  description: string;
  isVisible: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ videoUrl, isVisible }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<Video>(null);

  const handlePress = () => {
    setIsMuted(!isMuted);
    setIsPlaying(!isPlaying);
    console.log(`Video sound ${isMuted ? 'on' : 'off'}`);
    console.log(`Video ${isPlaying ? 'paused' : 'playing'}`);
  };

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.playAsync().catch((e) => {
        console.error('Error playing video:', e);
        console.error(e.message);
      });
    } else {
      videoRef.current?.pauseAsync().catch((e) => {
        console.error('Error pausing video:', e);
        console.error(e.message);
      });
    }
  }, [isVisible]);

  return (
    <View style={styles.reelItemContainer}>
      <TouchableOpacity style={styles.videoContainer} onPress={handlePress} activeOpacity={0.9}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={isPlaying}
          isMuted={isMuted}
          useNativeControls
          onError={(e) => {
            console.error('Video playback error:', e);
            console.error(e.message);
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reelItemContainer: {
    flex: 1,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },


});

export default ReelItem;