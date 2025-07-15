import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getPuzzlesWithProgress } from '@/utils/storage';
import { PuzzleCard } from '@/components/PuzzleCard';
import AdBanner from '@/components/AdBanner';
import { useAdManager } from '@/hooks/useAdManager';

export default function HomeTab() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { shouldShowBanner, shouldShowNativeAd } = useAdManager();

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      const puzzlesWithProgress = await getPuzzlesWithProgress();
      setPuzzles(puzzlesWithProgress);
    } catch (error) {
      console.error('Error loading puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPuzzles();
    }, [])
  );

  const renderPuzzleItem = ({ item, index }) => {
    const showNativeAd = shouldShowNativeAd(index);
    
    return (
      <View>
        <PuzzleCard puzzle={item} />
        {showNativeAd && (
          <AdBanner 
            type="native" 
            style={styles.nativeAdContainer}
          />
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Esoterica Puzzles</Text>
      <Text style={styles.headerSubtitle}>
        Unlock mystical wisdom through sacred geometry
      </Text>
      
      {/* Banner ad at top */}
      {shouldShowBanner() && (
        <AdBanner 
          type="banner" 
          style={styles.headerBannerAd}
        />
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Banner ad at bottom */}
      {shouldShowBanner() && (
        <AdBanner 
          type="banner" 
          style={styles.footerBannerAd}
        />
      )}
      <Text style={styles.footerText}>
        Complete puzzles to unlock journal entries and mystical insights
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bb9d60" />
        <Text style={styles.loadingText}>Loading mystical puzzles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={puzzles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPuzzleItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#bb9d60',
    fontFamily: 'Rye',
  },
  listContainer: {
    padding: 16,
    paddingTop: 80, // Account for header
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#bb9d60',
    fontFamily: 'Rye',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  headerBannerAd: {
    width: '100%',
    marginTop: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  nativeAdContainer: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  footerBannerAd: {
    width: '100%',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
});