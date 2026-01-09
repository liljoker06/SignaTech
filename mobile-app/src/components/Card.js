import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function Card({ children, style, elevated = false }) {
  return (
    <View style={[styles.container, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
    padding: SIZES.paddingLG,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  elevated: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
