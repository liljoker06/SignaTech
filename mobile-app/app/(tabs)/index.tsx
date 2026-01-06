import React from 'react';
import { StyleSheet, ScrollView, Pressable, View, ImageBackground, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Fond avec blur */}
      <ImageBackground
        source={require('@/assets/images/partial-react-logo.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.backdrop} />
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🤟</Text>
            <Text style={styles.title}>SignaTech</Text>
            <Text style={styles.subtitle}>Traduisez la langue des signes en temps réel</Text>
          </View>

          {/* Main Action Button */}
          <Pressable 
            onPress={() => router.push('/(tabs)/translate')}
            style={({ pressed }) => [styles.mainActionCard, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#FFE658', '#FFC900', '#FFAA00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainActionGradient}
            >
              <Ionicons name="videocam" size={48} color="#1A1A1A" />
              <Text style={styles.mainActionTitle}>Démarrer la traduction</Text>
              <Text style={styles.mainActionSubtitle}>Utilisez votre caméra pour traduire</Text>
            </LinearGradient>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0B' },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },

  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 64, marginBottom: 8 },
  title: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: '700', 
    letterSpacing: 0.5, 
    marginBottom: 8 
  },
  subtitle: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 16, 
    textAlign: 'center',
    paddingHorizontal: 20
  },

  mainActionCard: { 
    borderRadius: 24, 
    overflow: 'hidden', 
    marginBottom: 24,
    shadowColor: '#FFE658',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainActionGradient: { 
    padding: 32, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  mainActionTitle: { 
    color: '#1A1A1A', 
    fontSize: 24, 
    fontWeight: '700', 
    marginTop: 16,
    marginBottom: 4
  },
  mainActionSubtitle: { 
    color: 'rgba(26,26,26,0.7)', 
    fontSize: 14, 
    textAlign: 'center' 
  },

  quickActions: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 24 
  },
  actionCard: { 
    width: '48%', 
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,230,88,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  actionDescription: { 
    color: 'rgba(255,255,255,0.6)', 
    fontSize: 12, 
    textAlign: 'center' 
  },

  infoBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,230,88,0.3)',
  },
  infoBannerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
  },

  pressed: { transform: [{ scale: 0.97 }], opacity: 0.8 },
});
