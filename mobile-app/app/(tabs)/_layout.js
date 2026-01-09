import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import DrawerMenu from '../../src/components/DrawerMenu';

export default function TabsLayout() {
  const { t } = useTranslation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="menu" size={28} color="#FFD700" />
            </TouchableOpacity>
          ),
          // Activer le swipe sur iOS et Android
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        {/* Ordre des onglets : Traduire - Cours - Explorer */}
        <Tabs.Screen
          name="translate"
          options={{
            title: t('nav.translate'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="videocam" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: t('nav.courses'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: t('nav.explore'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}
