import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Platform, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { useQuery } from '@apollo/client/react';
import { SCHOOLS_QUERY } from '../../lib/graphql/queries';

const MapScreen = () => {
  const { t } = useTranslation();
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState(null);

  const { data, loading, error } = useQuery(SCHOOLS_QUERY);
  
  const mockSchools = [
    {
      id: 1,
      name: 'École LSF Paris',
      description: 'Centre de formation en langue des signes',
      address: '10 Rue de Rivoli, 75001 Paris',
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522
    },
    {
      id: 2,
      name: 'Centre LSF Lyon',
      description: 'Institut de langue des signes française',
      address: '5 Place Bellecour, 69002 Lyon',
      city: 'Lyon',
      country: 'France',
      latitude: 45.7597,
      longitude: 4.8322
    },
    {
      id: 3,
      name: 'Institut LSF Marseille',
      description: 'Formation et apprentissage LSF',
      address: 'Vieux Port, 13001 Marseille',
      city: 'Marseille',
      country: 'France',
      latitude: 43.2965,
      longitude: 5.3698
    }
  ];
  
  const addMockCoordinates = (schoolList) => {
    return schoolList.map((school, index) => {
      const baseLat = 48.8566;
      const baseLng = 2.3522;
      return {
        ...school,
        latitude: school.latitude || (baseLat + (Math.random() - 0.5) * 0.1),
        longitude: school.longitude || (baseLng + (Math.random() - 0.5) * 0.1),
      };
    });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    // données graphql si dispo, sinon données de test
    const schoolsData = (data && data.schools && data.schools.length > 0) ? data.schools : mockSchools;
    const schoolsWithCoords = addMockCoordinates(schoolsData);
    
    if (search) {
      const filtered = schoolsWithCoords.filter(school =>
        school.name.toLowerCase().includes(search.toLowerCase()) ||
        (school.address && school.address.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(schoolsWithCoords);
    }
  }, [search, data]);

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
      } else {
        // si permission refusée, Paris en affichage
        setRegion({
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // si erreur, Paris en affichage
      setRegion({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  };
  
  if (loading && filteredSchools.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
     console.log("Map Error - Utilisation des données de test", error);
  }

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: '#FFD700', marginTop: 10 }}>Chargement de la localisation...</Text>
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
