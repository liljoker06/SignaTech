import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary', // primary | secondary | danger
  size = 'medium', // small | medium | large
  icon,
  style,
}) {
  const gradientColors = {
    primary: COLORS.gradientGold,
    secondary: COLORS.gradientDark,
    danger: COLORS.gradientRed,
  };

  const buttonSizes = {
    small: { paddingVertical: 10, fontSize: 14 },
    medium: { paddingVertical: 16, fontSize: 18 },
    large: { paddingVertical: 20, fontSize: 20 },
  };

  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.medium, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors[variant]}
        style={[styles.gradient, { paddingVertical: buttonSizes[size].paddingVertical }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#000' : '#fff'} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, { fontSize: buttonSizes[size].fontSize }, variant === 'primary' && styles.textDark]}>
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radiusMD,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  textDark: {
    color: '#000',
  },
  disabled: {
    opacity: 0.5,
  },
});
