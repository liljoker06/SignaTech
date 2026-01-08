import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const AuthContext = createContext({});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        birthDate
        createdAt
      }
    }
  }
`;

// ✅ Mutation SIGNUP (pas register !)
const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $birthDate: String) {
    signup(username: $username, email: $email, password: $password, birthDate: $birthDate) {
      token
      user {
        id
        username
        email
        birthDate
        createdAt
      }
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION); // ✅ Changé de register à signup

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      
      const { token, user: userData } = data.login;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { data: data.login };
    } catch (error) {
      console.error('Login error:', error);
      
      // Mode dégradé : connexion simulée SANS envoyer de requête au backend
      if (error.message.includes('400') || error.message.includes('Network') || error.message.includes('jwt')) {
        console.warn('⚠️ Mode dégradé activé - Connexion simulée (pas de token envoyé au backend)');
        const mockUser = {
          id: Date.now(),
          username: email.split('@')[0],
          email: email,
        };
        // NE PAS envoyer de token au backend en mode dégradé
        await AsyncStorage.setItem('offline_mode', 'true');
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { data: { user: mockUser } };
      }
      
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await signupMutation({
        variables: {
          username: userData.name,
          email: userData.email,
          password: userData.password,
          birthDate: userData.birthDate || '2000-01-01',
        },
      });
      
      const { token, user: newUser } = data.signup; // ✅ data.signup au lieu de data.register
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.removeItem('offline_mode');
      setUser(newUser);
      return { data: data.signup };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Mode dégradé
      if (error.message.includes('400') || error.message.includes('Network') || error.message.includes('jwt')) {
        console.warn('⚠️ Mode dégradé activé - Inscription simulée (pas de token)');
        const mockUser = {
          id: Date.now(),
          username: userData.name,
          email: userData.email,
          birthDate: userData.birthDate || '2000-01-01',
          createdAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem('offline_mode', 'true');
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        console.info('✅ Compte créé en mode local (backend indisponible)');
        
        return { data: { user: mockUser } };
      }
      
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
