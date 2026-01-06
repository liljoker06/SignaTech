import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// MODE OFFLINE pour tester sans backend
const OFFLINE_MODE = false;

const getApiUrl = () => {
  const LOCAL_IP = '192.168.1.18'; 

  if (Platform.OS === 'android') {
    return `http://${LOCAL_IP}:4000/api`;
  } else if (Platform.OS === 'ios') {
    return `http://${LOCAL_IP}:4000/api`;
  }
  return 'http://localhost:4000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Backend non accessible:', error.message);
    }
    return Promise.reject(error);
  }
);

// Fonction mock pour simuler le backend
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const authAPI = {
  login: async (email, password) => {
    if (OFFLINE_MODE) {
      await mockDelay();
      if (email === 'test@test.com' && password === 'test123') {
        return {
          data: {
            token: 'mock-token-123',
            user: { id: 1, name: 'Test User', email: email }
          }
        };
      }
      throw { response: { data: { message: 'Email ou mot de passe incorrect' } } };
    }
    return api.post('/auth/login', { email, password });
  },
  
  register: async (userData) => {
    if (OFFLINE_MODE) {
      await mockDelay();
      return {
        data: {
          token: 'mock-token-123',
          user: { id: 1, name: userData.name, email: userData.email }
        }
      };
    }
    return api.post('/auth/register', userData);
  },
  
  logout: async () => await AsyncStorage.removeItem('token'),
};

export const schoolsAPI = {
  getAll: async () => {
    if (OFFLINE_MODE) {
      await mockDelay();
      return {
        data: [
          {
            id: 1,
            name: 'École LSF Paris',
            address: '10 Rue de Rivoli, 75001 Paris',
            latitude: 48.8566,
            longitude: 2.3522
          },
          {
            id: 2,
            name: 'Centre LSF Lyon',
            address: '5 Place Bellecour, 69002 Lyon',
            latitude: 45.7597,
            longitude: 4.8322
          },
          {
            id: 3,
            name: 'Institut LSF Marseille',
            address: 'Vieux Port, 13001 Marseille',
            latitude: 43.2965,
            longitude: 5.3698
          }
        ]
      };
    }
    return api.get('/schools');
  },
  
  getById: async (id) => {
    if (OFFLINE_MODE) {
      await mockDelay();
      return {
        data: {
          id,
          name: `École LSF ${id}`,
          address: 'Adresse test',
          latitude: 48.8566,
          longitude: 2.3522
        }
      };
    }
    return api.get(`/schools/${id}`);
  },
};

export default api;
