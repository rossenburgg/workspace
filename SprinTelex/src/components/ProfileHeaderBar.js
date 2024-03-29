import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActionSheetIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '@env';

const ProfileHeaderBar = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      if (token) {
        try {
          const response = await axios.get(`${REACT_APP_SERVER_URL}/api/accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAccounts(response.data.accounts);
          setSelectedAccount(response.data.accounts[0].username); // Assuming the first account is the default
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
    };

    fetchAccounts();
  }, [token]);

  const handleSettingsPress = () => {
    if (!token) {
      console.log('Unauthorized access attempt to settings.');
      navigation.navigate('Login');
    } else {
      navigation.navigate('ProfileSettings');
    }
  };

  const showActionSheet = () => {
    const accountNames = accounts.map(account => account.username);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...accountNames],
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex !== 0) {
          const selectedName = accountNames[buttonIndex - 1];
          handleAccountChange(selectedName);
        }
      }
    );
  };

  const handleAccountChange = (accountName) => {
    console.log(`Switching to account: ${accountName}`);
    setSelectedAccount(accountName);
    // Here you would implement the logic to switch accounts, possibly involving API calls and updating the app's state
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsIcon}>
        <Icon name="settings" size={30} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.accountDropdown} onPress={showActionSheet}>
        <Text style={styles.accountText}>{selectedAccount}</Text>
        <Icon name="arrow-drop-down" size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  settingsIcon: {
    padding: 5,
  },
  accountDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  accountText: {
    marginRight: 5,
  },
});

export default ProfileHeaderBar;