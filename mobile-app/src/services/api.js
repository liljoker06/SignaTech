import axios from 'axios';
import { Platform } from 'react-native';

const OFFLINE_MODE = false; // ❌ Mode offline désactivé - Utilisation de GraphQL

// Ce fichier n'est plus utilisé - GraphQL avec Apollo Client est maintenant actif
// Conservé pour compatibilité future si besoin de REST

const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://192.168.1.161:3000/api'; // ⬅️ Remplacez par VOTRE IP
  }
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
});

export const authAPI = {
  login: (email, password) => {
    if (OFFLINE_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'fake-token',
              user: { id: 1, name: 'John Doe', email },
            },
          });
        }, 1000);
      });
    }
    return api.post('/auth/login', { email, password });
  },
  register: (userData) => {
    if (OFFLINE_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'fake-token',
              user: { id: 1, name: userData.name, email: userData.email },
            },
          });
        }, 1000);
      });
    }
    return api.post('/auth/register', userData);
  },
  logout: () => {
    if (OFFLINE_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
    return api.post('/auth/logout');
  },
};

export const schoolsAPI = {
  getAll: () => {
    if (OFFLINE_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                name: 'École LSF Paris',
                address: '10 Rue de Rivoli, 75001 Paris',
                latitude: 48.8566,
                longitude: 2.3522,
              },
              {
                id: 2,
                name: 'Centre LSF Lyon',
                address: '5 Place Bellecour, 69002 Lyon',
                latitude: 45.7597,
                longitude: 4.8322,
              },
            ],
          });
        }, 1000);
      });
    }
    return api.get('/schools');
  },
};