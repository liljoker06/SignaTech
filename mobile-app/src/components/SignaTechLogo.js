import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignaTechLogo({ size = 60 }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.gradient}
      >
        <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>🤟</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontWeight: 'bold',
  },
});
