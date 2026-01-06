import React from 'react';
import RegisterScreen from '../../src/screens/RegisterScreen';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();
  
  return <RegisterScreen navigation={{
    navigate: (route) => {
      if (route === 'Login') {
        router.push('/auth/login');
      }
    }
  }} />;
}
