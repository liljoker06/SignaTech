import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import SignaTechLogo from '../../src/components/SignaTechLogo';

export default function TranslateScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [facing, setFacing] = useState('front');

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <SignaTechLogo size={100} />
        <Text style={styles.permissionTitle}>SignaTech</Text>
        <Text style={styles.permissionMessage}>
          Autoriser l'accès à la caméra pour traduire la langue des signes
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.buttonGradient}
          >
            <Ionicons name="camera" size={24} color="#000" />
            <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranslatedText('');
    setTimeout(() => {
      setTranslatedText('Bonjour, comment allez-vous ?');
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
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
        {/* Header avec logo */}
        <View style={styles.header}>
          <SignaTechLogo size={50} />
          <Text style={styles.headerTitle}>SignaTech</Text>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

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
          {/* Bouton signaler un bug en petit */}
          <TouchableOpacity style={styles.bugButtonSmall} onPress={handleReportBug}>
            <Ionicons name="warning" size={16} color="#FF3B30" />
            <Text style={styles.bugButtonText}>Signaler</Text>
          </TouchableOpacity>

          <View style={styles.controls}>
            {/* Bouton upload photo */}
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
              <Ionicons name="images" size={32} color="#FFD700" />
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
                  <Ionicons name="hand-right" size={40} color="#FFD700" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0f2027',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionMessage: {
    color: '#b0b0b0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  permissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 15,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 250,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFD700',
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFD700',
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFD700',
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFD700',
    borderBottomRightRadius: 10,
  },
  scanningLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFD700',
    position: 'absolute',
    top: '50%',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  translationContainer: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    right: 20,
  },
  translationBox: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  translationText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  bugButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bugButtonText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 8,
  },
  recordButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordButtonActive: {
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  recordButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  imageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  hint: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
