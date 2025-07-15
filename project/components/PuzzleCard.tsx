import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Platform
} from 'react-native';
import { Puzzle } from '../types';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Check } from 'lucide-react-native';

interface PuzzleCardProps {
  puzzle: Puzzle;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ puzzle }) => {
  const router = useRouter();
  
  const handlePress = () => {
    if (puzzle.isUnlocked) {
      router.push(`/puzzle/${puzzle.id}`);
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!puzzle.isUnlocked}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: puzzle.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {!puzzle.isUnlocked && (
          <View style={styles.lockOverlay}>
            <Lock size={28} color="#FFFFFF" />
          </View>
        )}
        
        {puzzle.isCompleted && (
          <View style={styles.completedBadge}>
            <Check size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <LinearGradient
        colors={['#EFEFEF', '#7D7D7D']}
        style={styles.infoContainer}
      >
        <Text style={styles.title} numberOfLines={1}>
          {puzzle.title}
        </Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.puzzleSize}>
            {puzzle.gridSize}x{puzzle.gridSize}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 8,
    ...Platform.select({
      web: {
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
        }
      }
    })
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 4,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  puzzleSize: {
    fontSize: 12,
    color: '#4A4A4A',
  }
});

export default PuzzleCard;