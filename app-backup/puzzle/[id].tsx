import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SimplePuzzleGame from '@/components/SimplePuzzleGame';
import { Puzzle } from '@/types';
import { getPuzzlesWithProgress } from '@/utils/storage';
import Sidebar from '@/components/Sidebar';

export default function PuzzleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const { width, height } = useWindowDimensions();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // Custom menu icon component to avoid lucide-react-native web issues
  const MenuIcon = () => (
    <View style={styles.menuIcon}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </View>
  );
  
  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      if (id) {
        const puzzles = await getPuzzlesWithProgress();
        const foundPuzzle = puzzles.find(p => p.id === id);
        
        if (foundPuzzle && foundPuzzle.isUnlocked) {
          setPuzzle(foundPuzzle);
        }
      }
      setLoading(false);
    };
    
    loadPuzzle();
  }, [id]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bb9d60" />
      </View>
    );
  }
  
  if (!puzzle) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#bb9d60" />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setIsSidebarVisible(true)}
      >
        <MenuIcon />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://d2vfmc14ehtaht.cloudfront.net/711c61a52261018e62/40d9c02617681139ba911d40634ed4cd3a9f52f4.png?format=webp' }}
          style={styles.logo}
        />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Puzzle Game */}
        <View style={styles.puzzleGameContainer}>
          <SimplePuzzleGame puzzle={puzzle} />
        </View>
      </ScrollView>
      
      <Sidebar 
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 90,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  puzzleGameContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#bb9d60',
    borderRadius: 1.5,
  },
});