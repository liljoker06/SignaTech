import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getApiUrl = () => {

  const LOCAL_IP = '192.168.1.18'; 
  
  if (Platform.OS === 'android') {
    return `http://${LOCAL_IP}:4000/graphql`; 
  }
  if (Platform.OS === 'ios') {
    return `http://${LOCAL_IP}:4000/graphql`; 
  }
  return 'http://localhost:4000/graphql'; // Web
};

const httpLink = createHttpLink({
  uri: getApiUrl(),
});

// Middleware pour ajouter le token aux headers
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Utilitaires pour gérer le token
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('authToken', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('authToken');
};
