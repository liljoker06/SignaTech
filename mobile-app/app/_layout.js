import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import '../src/i18n';

// Import dynamique avec gestion d'erreur
let ApolloProvider, apolloClient, AuthProvider, useAuth;

try {
  // Import Apollo Client
  const apolloModule = require('@apollo/client');
  ApolloProvider = apolloModule.ApolloProvider;
  
  // Import Apollo config
  const apolloConfig = require('../src/config/apollo');
  apolloClient = apolloConfig.apolloClient;
  
  // Import Auth
  const authModule = require('../src/contexts/AuthContext');
  AuthProvider = authModule.AuthProvider;
  useAuth = authModule.useAuth;
  
  console.log('✅ Tous les modules chargés avec succès');
} catch (error) {
  console.error('❌ Erreur de chargement:', error);
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !navigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/map');
    }
  }, [user, loading, navigationState?.key]);

  if (loading) return null;

  return <Slot />;
}

export default function Layout() {
  // Vérifier que tous les modules sont chargés
  if (!ApolloProvider || !apolloClient || !AuthProvider) {
    throw new Error('Modules Apollo Client ou Auth non chargés. Exécutez: npm install @apollo/client graphql');
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ApolloProvider>
  );
}
