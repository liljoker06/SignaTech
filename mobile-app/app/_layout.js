import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client/react';

import { apolloClient } from '../src/config/apollo';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

import '../src/i18n';

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
