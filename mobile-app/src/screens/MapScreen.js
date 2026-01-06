import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { schoolsAPI } from '../services/api';
import * as Location from 'expo-location';

const MapScreen = () => {
  const { t } = useTranslation();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    loadSchools();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(search.toLowerCase()) ||
        school.address.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(schools);
    }
  }, [search, schools]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadSchools = async () => {
    try {
      const response = await schoolsAPI.getAll();
      setSchools(response.data);
      setFilteredSchools(response.data);
    } catch (error) {
      console.error('Error loading schools:', error);
      // Données de test si le backend n'est pas disponible
      const mockSchools = [
        {
          id: 1,
          name: 'École LSF Paris',
          address: '10 Rue de Rivoli, 75001 Paris',
          latitude: 48.8566,
          longitude: 2.3522
        },
        {
          id: 2,
          name: 'Centre LSF Lyon',
          address: '5 Place Bellecour, 69002 Lyon',
          latitude: 45.7597,
          longitude: 4.8322
        }
      ];
      setSchools(mockSchools);
      setFilteredSchools(mockSchools);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('map.searchPlaceholder')}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
      >
        {filteredSchools.map((school) => (
          <Marker
            key={school.id}
            coordinate={{
              latitude: school.latitude,
              longitude: school.longitude,
            }}
            title={school.name}
            description={school.address}
            pinColor="#FFD700"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
