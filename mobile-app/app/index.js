import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Redirect href="/(tabs)/map" /> : <Redirect href="/auth/login" />;
}
