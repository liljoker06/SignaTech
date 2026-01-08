import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator, 
  Platform, 
  Text, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
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
  const [showSchoolsList, setShowSchoolsList] = useState(false);

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

  const handleSchoolWebsite = async (website) => {
    if (!website) {
      Alert.alert('Information', 'Aucun site web disponible pour cette école');
      return;
    }

    try {
      const url = website.startsWith('http') ? website : `https://${website}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le site web');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le site web');
    }
  };

  const handleEmailContact = async (email) => {
    if (!email) {
      Alert.alert('Information', 'Aucun email disponible pour cette école');
      return;
    }

    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
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

      {/* Badge compteur de résultats - CLIQUABLE */}
      {search.length > 0 && (
        <TouchableOpacity 
          style={styles.resultsBadge}
          onPress={() => setShowSchoolsList(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.resultsBadgeText}>
            {filteredSchools.length} école{filteredSchools.length > 1 ? 's' : ''} trouvée{filteredSchools.length > 1 ? 's' : ''}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#000" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
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

      {/* Modal liste des écoles */}
      <Modal
        visible={showSchoolsList}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSchoolsList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header du modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {filteredSchools.length} école{filteredSchools.length > 1 ? 's' : ''} trouvée{filteredSchools.length > 1 ? 's' : ''}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowSchoolsList(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={28} color="#FFD700" />
              </TouchableOpacity>
            </View>

            {/* Liste des écoles */}
            <ScrollView 
              style={styles.schoolsList}
              showsVerticalScrollIndicator={false}
            >
              {filteredSchools.map((school, index) => (
                <View key={school.id} style={styles.schoolCard}>
                  {/* Numéro et nom */}
                  <View style={styles.schoolHeader}>
                    <View style={styles.schoolNumber}>
                      <Text style={styles.schoolNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.schoolName}>{school.name}</Text>
                  </View>

                  {/* Détails */}
                  <View style={styles.schoolDetails}>
                    {/* Localisation */}
                    {(school.city || school.country) && (
                      <View style={styles.schoolDetailRow}>
                        <Ionicons name="location" size={18} color="#FFD700" />
                        <Text style={styles.schoolDetailText}>
                          {school.city}{school.city && school.country ? ', ' : ''}{school.country}
                        </Text>
                      </View>
                    )}

                    {/* Description */}
                    {school.description && (
                      <View style={styles.schoolDetailRow}>
                        <Ionicons name="information-circle" size={18} color="#FFD700" />
                        <Text style={styles.schoolDetailText} numberOfLines={2}>
                          {school.description}
                        </Text>
                      </View>
                    )}

                    {/* Boutons d'action */}
                    <View style={styles.schoolActions}>
                      {/* Bouton Site Web */}
                      {school.website && (
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => handleSchoolWebsite(school.website)}
                        >
                          <Ionicons name="globe-outline" size={20} color="#FFD700" />
                          <Text style={styles.actionButtonText}>Site web</Text>
                        </TouchableOpacity>
                      )}

                      {/* Bouton Email */}
                      {school.contact_email && (
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => handleEmailContact(school.contact_email)}
                        >
                          <Ionicons name="mail-outline" size={20} color="#FFD700" />
                          <Text style={styles.actionButtonText}>Contact</Text>
                        </TouchableOpacity>
                      )}

                      {/* Bouton Localiser sur la carte */}
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                          setShowSchoolsList(false);
                          setRegion({
                            latitude: parseFloat(school.latitude),
                            longitude: parseFloat(school.longitude),
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          });
                        }}
                      >
                        <Ionicons name="navigate-outline" size={20} color="#FFD700" />
                        <Text style={styles.actionButtonText}>Localiser</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginLeft: -120,
    width: 240,
    zIndex: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolsList: {
    padding: 15,
  },
  schoolCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  schoolNumber: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  schoolNumberText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  schoolDetails: {
    gap: 10,
  },
  schoolDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  schoolDetailText: {
    fontSize: 14,
    color: '#b0b0b0',
    flex: 1,
    lineHeight: 20,
  },
  schoolActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default MapScreen;
