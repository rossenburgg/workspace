import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import onboardingContent from '../OnboardingContent';
import colorPalette from '../config/colorPalette';

function OnboardingScreen() {
  const navigation = useNavigation();

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = () => {
    navigation.navigate('Permission');
  };

  return (
    <AppIntroSlider 
      renderItem={renderSlide} 
      data={onboardingContent} 
      onDone={onDone}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      doneLabel="Get Started"
      nextLabel="Next"
      skipLabel="Skip"
      buttonStyle={styles.button} // Style for the Next, Done, and Skip buttons
      buttonTextStyle={styles.buttonText} // Style for the text inside the buttons
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colorPalette.background, // Ensuring the background of each slide matches our color scheme
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colorPalette.primary,
    marginTop: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: colorPalette.text,
    textAlign: 'center',
  },
  dotStyle: {
    backgroundColor: colorPalette.onboardingDot,
  },
  activeDotStyle: {
    backgroundColor: colorPalette.onboardingActiveDot,
  },
  button: {
    backgroundColor: colorPalette.primary, // Button background color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF', // Button text color
  },
});

export default OnboardingScreen;