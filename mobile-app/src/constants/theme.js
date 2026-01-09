export const COLORS = {
  // Gradients
  gradientDark: ['#0f2027', '#203a43', '#2c5364'],
  gradientGold: ['#FFD700', '#FFA500'],
  gradientRed: ['#FF3B30', '#C51A0E'],
  
  // Main colors
  primary: '#FFD700',
  secondary: '#FFA500',
  background: '#1a1a2e',
  backgroundLight: '#203a43',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#b0b0b0',
  textMuted: '#999999',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

export const SIZES = {
  // Font sizes
  fontXS: 12,
  fontSM: 14,
  fontMD: 16,
  fontLG: 20,
  fontXL: 24,
  font2XL: 32,
  font3XL: 42,
  
  // Spacing
  paddingXS: 8,
  paddingSM: 12,
  paddingMD: 16,
  paddingLG: 20,
  paddingXL: 30,
  
  // Border radius
  radiusSM: 8,
  radiusMD: 12,
  radiusLG: 15,
  radiusXL: 20,
  radiusRound: 999,
  
  // Icon sizes
  iconSM: 16,
  iconMD: 20,
  iconLG: 28,
  iconXL: 40,
  
  // Safe area
  headerHeight: 60,
  tabBarHeight: 60,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System',
};

export default {
  COLORS,
  SIZES,
  SHADOWS,
  FONTS,
};
