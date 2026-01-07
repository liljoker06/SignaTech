import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🤟</Text>
          <Text style={styles.title}>SignaTech</Text>
          <Text style={styles.subtitle}>
            Traduisez la langue des signes en temps réel
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => router.push('/(tabs)/translate')}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.cardGradient}
            >
              <Ionicons name="videocam" size={60} color="#000" />
              <Text style={styles.cardTitle}>Démarrer la traduction</Text>
              <Text style={styles.cardSubtitle}>
                Utilisez votre caméra pour traduire
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2027',
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#b0b0b0',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardGradient: {
    padding: 30,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});
