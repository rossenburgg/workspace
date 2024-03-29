import React from 'react';
import { SafeAreaView, StyleSheet, AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView style={styles.container}>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
});

AppRegistry.registerComponent('SprinTelex', () => App);
export default App;