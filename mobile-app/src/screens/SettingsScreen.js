import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { changeLanguage } from '../i18n';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleLanguageChange = async (lang) => {
    await changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t('settings.language')}</Text>

      <TouchableOpacity
        style={[styles.option, currentLang === 'fr' && styles.selectedOption]}
        onPress={() => handleLanguageChange('fr')}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name="flag"
            size={24}
            color={currentLang === 'fr' ? '#FFD700' : '#999'}
          />
          <Text style={[styles.optionText, currentLang === 'fr' && styles.selectedText]}>
            {t('settings.french')}
          </Text>
        </View>
        {currentLang === 'fr' && (
          <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, currentLang === 'en' && styles.selectedOption]}
        onPress={() => handleLanguageChange('en')}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name="flag"
            size={24}
            color={currentLang === 'en' ? '#FFD700' : '#999'}
          />
          <Text style={[styles.optionText, currentLang === 'en' && styles.selectedText]}>
            {t('settings.english')}
          </Text>
        </View>
        {currentLang === 'en' && (
          <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedOption: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#b0b0b0',
    marginLeft: 15,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
