import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function CoursesScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const categories = [
    { id: 'all', name: 'Tous', icon: 'apps' },
    { id: 'beginner', name: 'Débutant', icon: 'leaf' },
    { id: 'intermediate', name: 'Intermédiaire', icon: 'star-half' },
    { id: 'advanced', name: 'Avancé', icon: 'trophy' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Alphabet en LSF',
      description: 'Apprenez l\'alphabet en langue des signes française',
      duration: '15 min',
      level: 'beginner',
      thumbnail: 'https://via.placeholder.com/300x180/FFD700/000000?text=Alphabet',
      lessons: 26,
    },
    {
      id: 2,
      title: 'Salutations de base',
      description: 'Bonjour, merci, au revoir et plus encore',
      duration: '20 min',
      level: 'beginner',
      thumbnail: 'https://via.placeholder.com/300x180/FFA500/000000?text=Salutations',
      lessons: 10,
    },
    {
      id: 3,
      title: 'Vie quotidienne',
      description: 'Vocabulaire pour les situations quotidiennes',
      duration: '30 min',
      level: 'intermediate',
      thumbnail: 'https://via.placeholder.com/300x180/FF6B6B/FFFFFF?text=Quotidien',
      lessons: 15,
    },
    {
      id: 4,
      title: 'Expressions idiomatiques',
      description: 'Phrases et expressions courantes en LSF',
      duration: '25 min',
      level: 'intermediate',
      thumbnail: 'https://via.placeholder.com/300x180/4ECDC4/000000?text=Expressions',
      lessons: 12,
    },
    {
      id: 5,
      title: 'Conversations avancées',
      description: 'Dialogues complexes et grammaire avancée',
      duration: '40 min',
      level: 'advanced',
      thumbnail: 'https://via.placeholder.com/300x180/95E1D3/000000?text=Avancé',
      lessons: 20,
    },
  ];

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

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('courses.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('courses.subtitle')}</Text>
        </View>

        {/* Barre de recherche */}
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

        {/* Catégories */}
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

        {/* Liste des cours */}
        <View style={styles.coursesContainer}>
          {filteredCourses.map(course => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/course/${course.id}`)}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: course.thumbnail }}
                  style={styles.thumbnail}
                />
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
                    <Ionicons name="book-outline" size={16} color="#FFD700" />
                    <Text style={styles.courseMetaText}>{course.lessons} leçons</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredCourses.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#666" />
              <Text style={styles.emptyStateText}>Aucun cours trouvé</Text>
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
  thumbnail: {
    width: '100%',
    height: '100%',
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
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
  },
});
