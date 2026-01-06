import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TranslateScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [translatedText, setTranslatedText] = useState('');

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.root}>
        <ImageBackground
          source={require('@/assets/images/partial-react-logo.png')}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.backdrop} />
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>

        <SafeAreaView style={styles.safe}>
          <StatusBar style="light" />
          <View style={styles.permissionContainer}>
            <Ionicons name="camera" size={64} color="#FFE658" />
            <Text style={styles.permissionTitle}>Accès à la caméra</Text>
            <Text style={styles.permissionText}>
              SignaTech a besoin d'accéder à votre caméra pour traduire la langue des signes en temps réel
            </Text>
            <Pressable
              onPress={requestPermission}
              style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={['#FFE658', '#FFC900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.permissionButtonGradient}
              >
                <Text style={styles.permissionButtonText}>Autoriser</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('@/assets/images/partial-react-logo.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.backdrop} />
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Traduction en direct</Text>
            <Text style={styles.subtitle}>Positionnez vos mains dans le cadre</Text>
          </View>

          {/* boite camera */}
          <View style={styles.cameraContainer}>
            <View style={styles.cameraFrame}>
              <CameraView style={styles.camera} facing={facing} />
              
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* camera retourner */}
            <Pressable
              style={({ pressed }) => [styles.flipButton, pressed && styles.pressed]}
              onPress={toggleCameraFacing}
            >
              <BlurView intensity={20} tint="dark" style={styles.flipButtonBlur}>
                <Ionicons name="camera-reverse" size={28} color="white" />
              </BlurView>
            </Pressable>
          </View>

          {/* Translation Result */}
          <View style={styles.resultContainer}>
            <BlurView intensity={15} tint="dark" style={styles.resultBlur}>
              <Text style={styles.resultLabel}>Traduction :</Text>
              <Text style={styles.resultText}>
                {translatedText || 'En attente de détection...'}
              </Text>
            </BlurView>
          </View>


        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0B' },
  safe: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
  title: { color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },

  // camera
  cameraContainer: { alignItems: 'center', marginBottom: 24 },
  cameraFrame: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFE658',
    position: 'relative',
    shadowColor: '#FFE658',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  camera: { flex: 1 },

  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFE658',
  },
  topLeft: { top: 10, left: 10, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 10, right: 10, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 10, left: 10, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 10, right: 10, borderBottomWidth: 4, borderRightWidth: 4 },

  flipButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 25,
    overflow: 'hidden',
  },
  flipButtonBlur: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,230,88,0.3)',
  },
  resultBlur: { padding: 20 },
  resultLabel: {
    color: '#FFE658',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    minHeight: 50,
  },

  actions: { marginBottom: 20 },
  actionButton: { borderRadius: 16, overflow: 'hidden' },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: { color: '#1A1A1A', fontSize: 18, fontWeight: '700' },

  // perm
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  permissionButtonGradient: { paddingVertical: 16, alignItems: 'center' },
  permissionButtonText: { color: '#1A1A1A', fontSize: 18, fontWeight: '700' },

  pressed: { transform: [{ scale: 0.97 }], opacity: 0.8 },
});
