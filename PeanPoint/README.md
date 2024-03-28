# PeanPoint

PeanPoint is a React Native mobile application designed to help basketball enthusiasts easily locate nearby basketball courts. Leveraging the user's current location, it displays courts on an interactive map, offering details such as photos and user reviews upon selection. Inspired by the simplicity of the UberEats map interface, PeanPoint seeks to provide a seamless and user-friendly experience for its users.

## Overview

The app is built using React Native with the Expo framework, enabling cross-platform support for both iOS and Android devices. It uses React Navigation for screen transitions and integrates the Google Maps API for map rendering and location services. The backend, developed with Node.js, interacts with MongoDB for storing and retrieving data about basketball courts, including locations, pictures, and user reviews.

## Features

- **User Onboarding:** Introduces the app's functionalities with a modern UI.
- **Interactive Map:** Displays nearby basketball courts with custom markers.
- **Court Details Bottom Sheet:** Shows detailed information about a court, including pictures and reviews, upon marker selection.

## Getting Started

### Requirements

- Node.js
- Expo CLI
- MongoDB
- Google Maps API key

### Quickstart

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up your `.env` file with your MongoDB URI and Google Maps API key.
4. Run the app using `npx expo start` and follow the instructions to view on your device or emulator.

### License

Copyright (c) 2024.