import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import YouTubePlayer from '../../src/components/YouTubePlayer';
import { coursesData } from '../../src/services/youtubeService';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const course = coursesData[id] || coursesData[1];

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        {course.lessons.map((lesson) => (
          <View key={lesson.id} style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
            
            <View style={styles.lessonMeta}>
              <Ionicons name="time-outline" size={16} color="#FFD700" />
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
            
            {/* Lecteur YouTube intégré */}
            <View style={styles.videoContainer}>
              <YouTubePlayer videoId={lesson.youtubeId} height={220} />
            </View>

            <View style={styles.playInfo}>
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
              <Text style={styles.playInfoText}>Vidéo YouTube</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#b0b0b0',
    lineHeight: 22,
  },
  lessonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 10,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 6,
    fontWeight: '600',
  },
  videoContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  playInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  playInfoText: {
    color: '#999',
    marginLeft: 8,
    fontSize: 14,
  },
});
