import React from 'react';
import LoginScreen from '../../src/screens/LoginScreen';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  
  return <LoginScreen navigation={{
    navigate: (route) => {
      if (route === 'Register') {
        router.push('/auth/register');
      }
    }
  }} />;
}
