import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  token: null,
  setToken: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token from storage:', userToken);
        setToken(userToken);
      } catch (e) {
        console.error('Error retrieving token from storage:', e.message, e.stack);
      }
    };

    bootstrapAsync();
  }, []);

  const authContextValue = {
    token,
    setToken: async (newToken) => {
      try {
        if (newToken) {
          await AsyncStorage.setItem('userToken', newToken);
          console.log('Token set in storage:', newToken);
        } else {
          await AsyncStorage.removeItem('userToken');
          console.log('Token removed from storage');
        }
        setToken(newToken);
      } catch (e) {
        console.error('Error setting token in storage:', e.message, e.stack);
      }
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };