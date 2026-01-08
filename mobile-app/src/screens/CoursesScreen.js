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
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { COURSE_LEVEL_COLORS, COURSE_LEVEL_LABELS } from '../constants';
import { useCoursesData } from '../hooks/useCoursesData';
import Card from '../components/Card';

export default function CoursesScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const { courses, loading, error } = useCoursesData();

  const categories = [
    { id: 'all', name: 'Tous', icon: 'apps' },
    { id: 'beginner', name: 'Débutant', icon: 'leaf' },
    { id: 'intermediate', name: 'Intermédiaire', icon: 'star-half' },
    { id: 'advanced', name: 'Avancé', icon: 'trophy' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.level === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des cours...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('courses.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('courses.subtitle')}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={SIZES.iconMD} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('courses.searchPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
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
                size={SIZES.iconMD}
                color={selectedCategory === category.id ? '#000' : COLORS.primary}
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
            <Card elevated style={styles.emptyState}>
              <Ionicons name="cloud-offline-outline" size={80} color={COLORS.textMuted} />
              <Text style={styles.emptyStateTitle}>Aucune vidéo disponible</Text>
              <Text style={styles.emptyStateText}>
                {error 
                  ? 'Impossible de se connecter au serveur. Vérifiez votre connexion.'
                  : 'Aucun cours disponible pour le moment.'}
              </Text>
            </Card>
          )}

          {filteredCourses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/course/${course.id}`)}
            >
              <View style={styles.thumbnailContainer}>
                <View style={[styles.thumbnailPlaceholder, { backgroundColor: COURSE_LEVEL_COLORS[course.level] }]}>
                  <Ionicons name="videocam" size={SIZES.iconXL * 1.5} color={COLORS.text} />
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={SIZES.iconLG} color={COLORS.text} />
                </View>
                <View style={[styles.levelBadge, { backgroundColor: COURSE_LEVEL_COLORS[course.level] }]}>
                  <Text style={styles.levelBadgeText}>{COURSE_LEVEL_LABELS[course.level]}</Text>
                </View>
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>

                <View style={styles.courseFooter}>
                  <View style={styles.courseMetaItem}>
                    <Ionicons name="time-outline" size={SIZES.iconSM} color={COLORS.primary} />
                    <Text style={styles.courseMetaText}>{course.duration}</Text>
                  </View>
                  <View style={styles.courseMetaItem}>
                    <Ionicons name="logo-youtube" size={SIZES.iconSM} color="#FF0000" />
                    <Text style={styles.courseMetaText}>YouTube</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {courses.length > 0 && filteredCourses.length === 0 && (
            <Card elevated style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>
                Aucun cours trouvé{search ? ` pour "${search}"` : ''}
              </Text>
            </Card>
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
    color: COLORS.primary,
    fontSize: SIZES.fontMD,
    marginTop: SIZES.paddingMD,
  },
  header: {
    paddingTop: SIZES.headerHeight,
    paddingHorizontal: SIZES.paddingLG,
    paddingBottom: SIZES.paddingLG,
  },
  headerTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.paddingSM,
  },
  headerSubtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlayLight,
    marginHorizontal: SIZES.paddingLG,
    marginBottom: SIZES.paddingLG,
    paddingHorizontal: SIZES.paddingMD,
    borderRadius: SIZES.radiusMD,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  searchIcon: {
    marginRight: SIZES.paddingSM,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: SIZES.paddingMD,
    fontSize: SIZES.fontMD,
  },
  categoriesContainer: {
    marginBottom: SIZES.paddingLG,
  },
  categoriesContent: {
    paddingHorizontal: SIZES.paddingLG,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: SIZES.paddingMD,
    paddingVertical: SIZES.paddingSM,
    borderRadius: SIZES.radiusXL,
    marginRight: SIZES.paddingSM,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    marginLeft: SIZES.paddingSM,
  },
  categoryTextActive: {
    color: '#000',
  },
  coursesContainer: {
    paddingHorizontal: SIZES.paddingLG,
    paddingBottom: SIZES.paddingXL,
  },
  courseCard: {
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingLG,
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
    borderColor: COLORS.primary,
  },
  levelBadge: {
    position: 'absolute',
    top: SIZES.paddingSM,
    right: SIZES.paddingSM,
    paddingHorizontal: SIZES.paddingMD,
    paddingVertical: SIZES.paddingSM / 2,
    borderRadius: SIZES.radiusLG,
  },
  levelBadgeText: {
    color: COLORS.text,
    fontSize: SIZES.fontXS,
    fontWeight: 'bold',
  },
  courseInfo: {
    padding: SIZES.paddingMD,
  },
  courseTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.paddingSM,
  },
  courseDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textSecondary,
    marginBottom: SIZES.paddingMD,
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
    color: COLORS.textMuted,
    fontSize: SIZES.fontSM - 1,
    marginLeft: SIZES.paddingSM / 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.headerHeight,
  },
  emptyStateTitle: {
    color: COLORS.text,
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
    marginTop: SIZES.paddingLG,
    marginBottom: SIZES.paddingSM,
  },
  emptyStateText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontMD,
    marginTop: SIZES.paddingMD,
    textAlign: 'center',
    paddingHorizontal: SIZES.paddingXL * 1.3,
    lineHeight: 24,
  },
});