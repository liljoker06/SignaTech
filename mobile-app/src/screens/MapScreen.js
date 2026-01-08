import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Platform, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { gql, useQuery } from '@apollo/client';

const GET_SCHOOLS = gql`
  query GetSchools {
    schools {
      id
      name
      description
      address
      city
      country
      website
      contact_email
    }
  }
`;

const MapScreen = () => {
  const { t } = useTranslation();
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const { loading, error, data } = useQuery(GET_SCHOOLS);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (data?.schools) {
      // Le backend ne fournit pas latitude/longitude, on les simule
      const schoolsWithCoords = data.schools.map((school, index) => ({
        ...school,
        latitude: 48.8566 + (index * 0.1),
        longitude: 2.3522 + (index * 0.1),
      }));

      if (search) {
        const filtered = schoolsWithCoords.filter(school =>
          school.name?.toLowerCase().includes(search.toLowerCase()) ||
          school.city?.toLowerCase().includes(search.toLowerCase()) ||
          school.address?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSchools(filtered);
      } else {
        setFilteredSchools(schoolsWithCoords);
      }
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
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
    console.error('GraphQL Error:', error);
    
    // Utiliser des données mockées en cas d'erreur
    const mockSchools = [
      {
        id: 1,
        name: 'École LSF Paris',
        address: '10 Rue de Rivoli, 75001 Paris',
        latitude: 48.8566,
        longitude: 2.3522,
      },
      {
        id: 2,
        name: 'Centre LSF Lyon',
        address: '5 Place Bellecour, 69002 Lyon',
        latitude: 45.7597,
        longitude: 4.8322,
      },
    ];
    
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
          {mockSchools.map((school) => (
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
        
        {/* Message d'erreur discret */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'rgba(255, 215, 0, 0.9)', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: '#000', fontSize: 12, textAlign: 'center' }}>
            ⚠️ Connexion au serveur limitée - Données de démonstration affichées
          </Text>
        </View>
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
            description={`${school.city || ''} - ${school.address || ''}`}
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
