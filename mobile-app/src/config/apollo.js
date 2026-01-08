import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('Configuration Apollo Client...');

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error('EXPO_PUBLIC_API_URL is not defined');
}

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const offlineMode = await AsyncStorage.getItem('offline_mode');

  if (offlineMode === 'true') {
    console.log(' Mode offline détecté - Pas de token envoyé');
    return { headers };
  }

  const token = await AsyncStorage.getItem('token');

  if (token && token.startsWith('ey')) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }

  console.warn( 'Token invalide ou absent - Pas d\'autorisation envoyée');
  return { headers };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

console.log('Apollo Client configuré sur:', API_URL);
