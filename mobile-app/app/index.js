import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // ✅ Redirection vers Courses au lieu de Home/index
  return user ? <Redirect href="/(tabs)/courses" /> : <Redirect href="/auth/login" />;
}
