import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ corrige le warning

export default function AuthWelcome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('@/assets/images/partial-react-logo.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.backdrop} />
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        {/* petit gradient pour le contraste bas */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.45)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        {/* barre de statut claire */}
        <StatusBar style="light" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🤟</Text>
          <Text style={styles.title}>Bienvenue sur SignaTech</Text>
          <Text style={styles.subtitle}>Traduisez la langue des signes facilement</Text>
        </View>

        <View style={styles.btns}>
          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#FFE658', '#FFC900']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnTextDark}>Se connecter</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/signup-form')}
            style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
          >
            <Text style={styles.btnText}>Créer un compte</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0B' },
  safe: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  header: { alignItems: 'center', marginTop: 40 },
  logo: { fontSize: 80, marginBottom: 12 },
  title: { color: 'white', fontSize: 24, fontWeight: '700', letterSpacing: 0.3, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6, textAlign: 'center' },

  btns: { marginBottom: 32, gap: 12 },
  btn: { borderRadius: 14, overflow: 'hidden' },
  btnInner: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnOutline: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  btnTextDark: { color: '#1A1A1A', fontSize: 16, fontWeight: '700' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  pressed: { transform: [{ scale: 0.98 }] },
});