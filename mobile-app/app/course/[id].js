import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  // Données des cours avec vidéos locales
  const coursesData = {
    1: {
      title: '',
      description: 'Apprenez l\'alphabet complet en langue des signes française',
      lessons: [
        {
          id: 1,
          title: 'une journée',
          videoSource: require('../../../assets/videos/une-journee.mp4'),
          duration: '3:45',
          description: 'Apprenez les 26 lettres de l\'alphabet',
        },
      ],
    },
    2: {
      title: 'Salutations de base',
      description: 'Maîtrisez les expressions courantes',
      lessons: [
        {
          id: 1,
          title: 'Bonjour, Au revoir, Merci',
          videoSource: require('../../../assets/videos/salutations.mp4'),
          duration: '2:30',
          description: 'Les salutations essentielles',
        },
      ],
    },
    3: {
      title: 'Vie quotidienne',
      description: 'Vocabulaire pratique',
      lessons: [
        {
          id: 1,
          title: 'Vocabulaire quotidien',
          videoSource: require('../../../assets/videos/vie-quotidienne.mp4'),
          duration: '5:00',
          description: 'Mots et expressions du quotidien',
        },
      ],
    },
    4: {
      title: 'Expressions idiomatiques',
      description: 'Phrases courantes en LSF',
      lessons: [
        {
          id: 1,
          title: 'Expressions usuelles',
          videoSource: require('../../../assets/videos/expressions.mp4'),
          duration: '4:20',
          description: 'Les expressions les plus utilisées',
        },
      ],
    },
    5: {
      title: 'Conversations avancées',
      description: 'Niveau avancé',
      lessons: [
        {
          id: 1,
          title: 'Dialogue complexe',
          videoSource: require('../../../assets/videos/famille.mp4'),
          duration: '8:00',
          description: 'Conversations avancées en LSF',
        },
      ],
    },
  };

  const course = coursesData[id] || coursesData[1];

  const handlePlayPause = async (video) => {
    if (status.isPlaying) {
      await video.current.pauseAsync();
    } else {
      await video.current.playAsync();
    }
  };

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

        {course.lessons.map((lesson) => {
          const lessonVideoRef = useRef(null);
          
          return (
            <View key={lesson.id} style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
              <View style={styles.lessonMeta}>
                <Ionicons name="time-outline" size={16} color="#FFD700" />
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              </View>
              
              <View style={styles.videoContainer}>
                <Video
                  ref={lessonVideoRef}
                  source={lesson.videoSource}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              </View>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handlePlayPause(lessonVideoRef)}
                >
                  <Ionicons
                    name={status.isPlaying ? 'pause' : 'play'}
                    size={24}
                    color="#FFD700"
                  />
                  <Text style={styles.controlText}>
                    {status.isPlaying ? 'Pause' : 'Lecture'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 15,
  },
  video: {
    width: '100%',
    height: 200,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  controlText: {
    color: '#FFD700',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
