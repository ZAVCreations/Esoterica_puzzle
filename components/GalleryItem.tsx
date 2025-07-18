import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Puzzle } from '../types';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface GalleryItemProps {
  puzzle: Puzzle;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ puzzle }) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/gallery/${puzzle.id}`);
  };
  
  if (!puzzle.isCompleted) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: puzzle.completedGifUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{puzzle.title}</Text>
        <Text style={styles.quotePreview}>
          "{puzzle.quote.text.substring(0, 40)}..."
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    ...Platform.select({
      web: {
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        }
      }
    })
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quotePreview: {
    fontSize: 14,
    color: '#E9D8FD',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});

export default GalleryItem;