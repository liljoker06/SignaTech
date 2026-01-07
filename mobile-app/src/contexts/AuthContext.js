import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apolloClient } from '../../lib/apollo';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../services/graphql/userMutations';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); 
      if (token) {
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      });
      
      const { token, user: userData } = data.login;
      
      await AsyncStorage.setItem('authToken', token); // synchro avec apollo.ts
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return data.login;
    } catch (error) {
      console.error("Login Context Error", error);
      throw error;
    }
  };

  const register = async (userDataInput) => {
    try {
      const { username, email, password, birthDate } = userDataInput;

      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password, birthDate }
      });

      const { token, user: newUser } = data.signup;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      return data.signup;
    } catch (error) {
        console.error("Register Context Error", error);
        throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    await apolloClient.clearStore(); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
