import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

console.log('📡 Configuration Apollo Client...');

const getApiUrl = () => {
  // Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/graphql';
  }

  if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${host}:4000/graphql`;
  }

  return 'http://localhost:4000/graphql';
};

const httpLink = createHttpLink({
  uri: getApiUrl(),
});

const authLink = setContext(async (_, { headers }) => {
  // Vérifier si on est en mode offline
  const offlineMode = await AsyncStorage.getItem('offline_mode');
  
  // Si mode offline, NE PAS envoyer de token au backend
  if (offlineMode === 'true') {
    console.log('⚠️ Mode offline détecté - Pas de token envoyé');
    return { headers };
  }
  
  // Sinon, envoyer le token si disponible
  const token = await AsyncStorage.getItem('token');
  
  // Vérifier que le token est un vrai JWT (commence par ey...)
  if (token && token.startsWith('ey')) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }
  
  // Si le token n'est pas valide, ne rien envoyer
  console.warn('⚠️ Token invalide ou absent - Pas d\'autorisation envoyée');
  return { headers };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

console.log('✅ Apollo Client configuré sur:', getApiUrl());
