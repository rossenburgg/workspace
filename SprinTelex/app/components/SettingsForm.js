import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert, Switch } from 'react-native';
import api from '../utils/api'; // Adjust the import path as per your project structure

const SettingsForm = ({ initialSettings }) => {
  const [profileVisibility, setProfileVisibility] = useState(initialSettings.profileVisibility);
  const [notificationPreferences, setNotificationPreferences] = useState(initialSettings.notificationPreferences);

  const handleSubmit = async () => {
    try {
      await api.post('/settings/update', {
        profileVisibility,
        notificationPreferences,
      });
      Alert.alert('Success', 'Settings updated successfully.');
      console.log('Settings updated successfully:', { profileVisibility, notificationPreferences });
    } catch (error) {
      console.error('Error updating settings:', error);
      console.error('Error details:', error.message);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Switch
          value={profileVisibility}
          onValueChange={setProfileVisibility}
        />
        <Button title="Profile Visibility" onPress={() => setProfileVisibility(!profileVisibility)} />
      </View>
      <View style={styles.setting}>
        <Switch
          value={notificationPreferences}
          onValueChange={setNotificationPreferences}
        />
        <Button title="Notification Preferences" onPress={() => setNotificationPreferences(!notificationPreferences)} />
      </View>
      <Button title="Save Settings" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default SettingsForm;