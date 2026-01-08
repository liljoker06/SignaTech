import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import YouTubePlayer from '../../src/components/YouTubePlayer';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { COLORS, SIZES } from '../../src/constants/theme';

// Query GraphQL pour récupérer TOUTES les vidéos scrapées
const GET_ALL_VIDEOS = gql`
  query GetAllVideos {
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

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Récupérer TOUTES les vidéos scrapées
  const { loading, error, data } = useQuery(GET_ALL_VIDEOS);

  // Trouver la vidéo correspondante à l'ID
  const video = data?.videos?.find(v => v.id == id);

  // Données mockées en cas d'erreur ou vidéo non trouvée
  const mockCourse = {
    id: id,
    title: 'Cours LSF',
    description: 'Apprenez la langue des signes française',
    youtubeVideoId: 'pQO0oCFLeiA',
    duration: '0:27',
  };

  const course = video ? {
    id: video.id,
    title: video.titre,
    description: 'Cours de langue des signes française',
    youtubeVideoId: extractYouTubeId(video.url),
    duration: '5:00',
  } : mockCourse;

  if (loading) {
    return (
      <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement du cours...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={COLORS.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>
          {error && (
            <Text style={styles.warningText}>⚠️ Mode hors ligne - Données de démonstration</Text>
          )}
        </View>

        <View style={styles.lessonCard}>
          <Text style={styles.lessonTitle}>{course.title}</Text>
          <Text style={styles.lessonDescription}>{course.description}</Text>
          
          <View style={styles.lessonMeta}>
            <Ionicons name="time-outline" size={SIZES.iconSM} color={COLORS.primary} />
            <Text style={styles.lessonDuration}>{course.duration}</Text>
          </View>
          
          <View style={styles.videoContainer}>
            <YouTubePlayer videoId={course.youtubeVideoId} height={220} />
          </View>

          <View style={styles.playInfo}>
            <Ionicons name="logo-youtube" size={SIZES.iconMD} color="#FF0000" />
            <Text style={styles.playInfoText}>Vidéo YouTube scrapée depuis le backend</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZES.headerHeight,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SIZES.paddingLG,
  },
  headerSection: {
    paddingHorizontal: SIZES.paddingLG,
    marginBottom: SIZES.paddingLG,
  },
  title: {
    fontSize: SIZES.font2XL,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.paddingSM,
  },
  description: {
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  lessonCard: {
    backgroundColor: COLORS.overlayLight,
    marginHorizontal: SIZES.paddingLG,
    marginBottom: SIZES.paddingLG,
    borderRadius: SIZES.radiusLG,
    padding: SIZES.paddingMD,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  lessonTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.paddingSM,
  },
  lessonDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textSecondary,
    marginBottom: SIZES.paddingSM,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.paddingMD,
  },
  lessonDuration: {
    fontSize: SIZES.fontSM,
    color: COLORS.primary,
    marginLeft: SIZES.paddingSM / 2,
    fontWeight: '600',
  },
  videoContainer: {
    marginBottom: SIZES.paddingMD,
    borderRadius: SIZES.radiusSM,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  playInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.paddingSM,
  },
  playInfoText: {
    color: COLORS.textMuted,
    marginLeft: SIZES.paddingSM,
    fontSize: SIZES.fontSM,
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
  warningText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSM,
    marginTop: SIZES.paddingSM,
    textAlign: 'center',
  },
});
