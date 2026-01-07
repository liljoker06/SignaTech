import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { useEffect } from 'react';
import '../src/i18n';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '../lib/apollo';

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
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ApolloProvider>
  );
}
