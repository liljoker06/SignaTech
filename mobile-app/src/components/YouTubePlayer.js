import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function YouTubePlayer({ videoId, height = 200 }) {
  const youtubeAppUrl = Platform.OS === 'ios' 
    ? `youtube://watch?v=${videoId}`
    : `vnd.youtube:${videoId}`;
  const youtubeBrowserUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handleOpenVideo = async () => {
    try {
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(youtubeBrowserUrl);
      }
    } catch (error) {
      await Linking.openURL(youtubeBrowserUrl);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { height }]} 
      onPress={handleOpenVideo}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      >
        <View style={styles.playButton}>
          <Ionicons name="play" size={40} color="#fff" />
        </View>
        <View style={styles.youtubeTag}>
          <Ionicons name="logo-youtube" size={24} color="#FF0000" />
          <Text style={styles.youtubeText}>YouTube</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  youtubeTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  youtubeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
