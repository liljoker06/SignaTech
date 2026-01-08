import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

// Query GraphQL pour récupérer les vidéos scrapées depuis le backend
const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      id
      titre
      url
    }
  }
`;

// Fonction pour extraire l'ID YouTube depuis l'URL
const extractYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export default function CoursesScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  // Récupérer les vidéos scrapées depuis le backend GraphQL
  const { loading, error, data } = useQuery(GET_VIDEOS);

  const categories = [
    { id: 'all', name: 'Tous', icon: 'apps' },
    { id: 'beginner', name: 'Débutant', icon: 'leaf' },
    { id: 'intermediate', name: 'Intermédiaire', icon: 'star-half' },
    { id: 'advanced', name: 'Avancé', icon: 'trophy' },
  ];

  // ✅ UNIQUEMENT LES VIDÉOS DU BACKEND - PAS DE FALLBACK
  const courses = React.useMemo(() => {
    if (data?.videos && data.videos.length > 0) {
      console.log(`✅ ${data.videos.length} vidéos scrapées récupérées du backend`);
      
      return data.videos
        .map((video, index) => {
          const youtubeId = extractYouTubeId(video.url);
          
          if (!youtubeId) {
            console.warn(`⚠️ ID YouTube invalide pour: ${video.titre}`);
            return null;
          }

          return {
            id: video.id,
            title: video.titre,
            description: 'Cours de langue des signes française',
            duration: '5:00',
            level: index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced',
            youtubeVideoId: youtubeId,
            category: 'lsf',
          };
        })
        .filter(course => course !== null);
    }

    // ⚠️ AUCUN FALLBACK - RETOURNE UN TABLEAU VIDE
    console.warn('⚠️ Aucune vidéo disponible depuis le backend');
    return [];
  }, [data, error]);

  console.log(`📚 Nombre total de cours à afficher: ${courses.length}`);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.level === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#999';
    }
  };

  const getLevelText = (level) => {
    switch(level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return '';
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Chargement des cours...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('courses.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('courses.subtitle')}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('courses.searchPlaceholder')}
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#000' : '#FFD700'}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.coursesContainer}>
          {courses.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-offline-outline" size={80} color="#666" />
              <Text style={styles.emptyStateTitle}>Aucune vidéo disponible</Text>
              <Text style={styles.emptyStateText}>
                {error 
                  ? 'Impossible de se connecter au serveur. Vérifiez votre connexion.'
                  : 'Aucun cours disponible pour le moment.'}
              </Text>
            </View>
          )}

          {filteredCourses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              activeOpacity={0.8}
              onPress={() => {
                console.log(`🎬 Ouverture de la vidéo ${index + 1}/${filteredCourses.length}: ${course.title}`);
                router.push(`/course/${course.id}`);
              }}
            >
              <View style={styles.thumbnailContainer}>
                <View style={[styles.thumbnailPlaceholder, { backgroundColor: getLevelColor(course.level) }]}>
                  <Ionicons name="videocam" size={60} color="#fff" />
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={30} color="#fff" />
                </View>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
                  <Text style={styles.levelBadgeText}>{getLevelText(course.level)}</Text>
                </View>
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>

                <View style={styles.courseFooter}>
                  <View style={styles.courseMetaItem}>
                    <Ionicons name="time-outline" size={16} color="#FFD700" />
                    <Text style={styles.courseMetaText}>{course.duration}</Text>
                  </View>
                  <View style={styles.courseMetaItem}>
                    <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                    <Text style={styles.courseMetaText}>YouTube</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {courses.length > 0 && filteredCourses.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#666" />
              <Text style={styles.emptyStateText}>
                Aucun cours trouvé{search ? ` pour "${search}"` : ''}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 15,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  categoryButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryTextActive: {
    color: '#000',
  },
  coursesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  levelBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseInfo: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 12,
    lineHeight: 20,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseMetaText: {
    color: '#999',
    fontSize: 13,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
});