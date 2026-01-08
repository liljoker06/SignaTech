import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GET_SCHOOLS = gql`
  query GetSchools {
    schools {
      id
      name
      description
      city
      country
      website
      contact_email
      latitude
      longitude
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
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const { loading, error, data } = useQuery(GET_SCHOOLS);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (data?.schools) {
      const schoolsWithValidCoords = data.schools.filter(
        school => school.latitude != null && school.longitude != null
      );

      if (search && search.trim() !== '') {
        const searchLower = search.toLowerCase().trim();
        const filtered = schoolsWithValidCoords.filter(school => {
          const name = (school.name || '').toLowerCase();
          const city = (school.city || '').toLowerCase();
          const country = (school.country || '').toLowerCase();
          const description = (school.description || '').toLowerCase();
          
          return name.includes(searchLower) ||
                 city.includes(searchLower) ||
                 country.includes(searchLower) ||
                 description.includes(searchLower);
        });
        setFilteredSchools(filtered);
        
        // Ajuster la vue de la carte pour afficher tous les résultats
        if (filtered.length > 0) {
          const latitudes = filtered.map(s => parseFloat(s.latitude));
          const longitudes = filtered.map(s => parseFloat(s.longitude));
          const minLat = Math.min(...latitudes);
          const maxLat = Math.max(...latitudes);
          const minLon = Math.min(...longitudes);
          const maxLon = Math.max(...longitudes);
          
          setRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLon + maxLon) / 2,
            latitudeDelta: Math.max(maxLat - minLat + 0.5, 0.5),
            longitudeDelta: Math.max(maxLon - minLon + 0.5, 0.5),
          });
        }
      } else {
        setFilteredSchools(schoolsWithValidCoords);
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
        <Ionicons name="search" size={20} color="#FFD700" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('map.searchPlaceholder')}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Badge compteur de résultats */}
      {search.length > 0 && (
        <View style={styles.resultsBadge}>
          <Text style={styles.resultsBadgeText}>
            {filteredSchools.length} école{filteredSchools.length > 1 ? 's' : ''} trouvée{filteredSchools.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        region={region}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
      >
        {filteredSchools.map((school) => (
          <Marker
            key={school.id}
            coordinate={{
              latitude: parseFloat(school.latitude),
              longitude: parseFloat(school.longitude),
            }}
            title={school.name}
            description={`${school.city || ''}, ${school.country || ''}`}
            pinColor="#FFD700"
          />
        ))}
      </MapView>

      {/* Message si aucun résultat */}
      {search.length > 0 && filteredSchools.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={40} color="#999" />
          <Text style={styles.noResultsText}>Aucune école trouvée pour "{search}"</Text>
          <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearch('')}>
            <Text style={styles.clearSearchText}>Effacer la recherche</Text>
          </TouchableOpacity>
        </View>
      )}
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
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 15,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  resultsBadge: {
    position: 'absolute',
    top: 70,
    left: '50%',
    marginLeft: -100,
    width: 200,
    zIndex: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  resultsBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noResultsContainer: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  clearSearchButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
