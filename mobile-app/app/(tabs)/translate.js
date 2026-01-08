import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import SignaTechLogo from '../../src/components/SignaTechLogo';
import { styles, colors } from '../../styles/translate.styles';

import { startTranslation, stopTranslation } from '../../src/services/websocket/translateSocket';

export default function TranslateScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [facing, setFacing] = useState('front');
  const [menuVisible, setMenuVisible] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <SignaTechLogo size={100} />
        <Text style={styles.permissionTitle}>SignaTech</Text>
        <Text style={styles.permissionMessage}>
          Autoriser l&apos;accès à la caméra pour traduire la langue des signes
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.buttonGradient}
          >
            <Ionicons name="camera" size={24} color={colors.background} />
            <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

const handleStartRecording = () => {
  if (isRecording) return;

  setIsRecording(true);

  startTranslation((text) => {
    setTranslatedText(text);
  });
};

const handleStopRecording = () => {
  setIsRecording(false);
  stopTranslation();
};


  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTranslatedText('Traduction de l\'image : Bonjour !');
      setTimeout(() => setTranslatedText(''), 5000);
    }
  };

  const handleReportBug = () => {
    Alert.alert(
      'Signaler un problème',
      'Décrivez le problème que vous rencontrez',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Envoyer', 
          onPress: () => Alert.alert('Merci !', 'Votre signalement a été envoyé.')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView style={styles.camera} facing={facing}>
        {/* Header avec menu et flip camera */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
            <Ionicons name="ellipsis-horizontal" size={28} color={colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Menu dropdown */}
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setMenuVisible(false);
                handleReportBug();
              }}
            >
              <Ionicons name="warning" size={20} color={colors.danger} />
              <Text style={styles.menuItemText}>Signaler un problème</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Zone de scan avec overlay */}
        <View style={styles.scanArea}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
          
          {isRecording && (
            <View style={styles.scanningLine} />
          )}
        </View>

        {/* Texte traduit */}
        {translatedText && (
          <View style={styles.translationContainer}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.7)']}
              style={styles.translationBox}
            >
              <Text style={styles.translationText}>{translatedText}</Text>
            </LinearGradient>
          </View>
        )}

        {/* Contrôles en bas */}
        <View style={styles.bottomContainer}>
          <View style={styles.controls}>
            {/* Bouton upload photo */}
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
              <Ionicons name="images" size={32} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <View style={styles.recordButtonInner}>
                {isRecording ? (
                  <View style={styles.stopIcon} />
                ) : (
                  <Ionicons name="hand-right" size={40} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>

            {/* Espace vide pour équilibrer */}
            <View style={styles.imageButton} />
          </View>
          
          <Text style={styles.hint}>
            {isRecording ? 'Traduction en cours...' : 'Appuyez pour traduire'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}
