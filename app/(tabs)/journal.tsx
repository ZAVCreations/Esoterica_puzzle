import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getPuzzlesWithProgress } from '@/utils/storage';
import { Puzzle } from '@/types';
import AdBanner from '@/components/AdBanner';
import { useAdManager } from '@/hooks/useAdManager';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Custom icons
const XIcon = () => (
  <View style={styles.xIcon}>
    <View style={[styles.xLine, styles.xLine1]} />
    <View style={[styles.xLine, styles.xLine2]} />
  </View>
);

const DownloadIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.downloadIcon}>
      <View style={styles.downloadArrow} />
      <View style={styles.downloadLine} />
    </View>
  </View>
);

export default function JournalTab() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { shouldShowBanner, shouldShowNativeAd } = useAdManager();

  const loadCompletedPuzzles = async () => {
    try {
      setLoading(true);
      const allPuzzles = await getPuzzlesWithProgress();
      const completedPuzzles = allPuzzles.filter(puzzle => puzzle.isCompleted);
      setPuzzles(completedPuzzles);
    } catch (error) {
      console.error('Error loading completed puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCompletedPuzzles();
    }, [])
  );

  const handlePuzzlePress = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    setModalVisible(true);
  };

  const handleSaveImage = async (puzzle: Puzzle) => {
    try {
      if (Platform.OS === 'web') {
        // For web, open image in new tab
        window.open(puzzle.completedGifUrl, '_blank');
        return;
      }

      // For mobile platforms
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save images to your gallery.');
        return;
      }

      // Download the image
      const fileUri = FileSystem.documentDirectory + `${puzzle.title.replace(/\s+/g, '_')}.gif`;
      const downloadResult = await FileSystem.downloadAsync(puzzle.completedGifUrl, fileUri);
      
      if (downloadResult.status === 200) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        Alert.alert('Success', 'Image saved to your gallery!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    }
  };

  const renderPuzzleItem = ({ item, index }: { item: Puzzle; index: number }) => {
    const showNativeAd = shouldShowNativeAd(index);
    
    return (
      <View>
        <TouchableOpacity
          style={styles.puzzleCard}
          onPress={() => handlePuzzlePress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.completedGifUrl }}
            style={styles.puzzleImage}
            resizeMode="cover"
          />
          <View style={styles.puzzleInfo}>
            <Text style={styles.puzzleTitle}>{item.title}</Text>
            <Text style={styles.puzzleQuote} numberOfLines={2}>
              "{item.quote.text}"
            </Text>
            <Text style={styles.puzzleAuthor}>— {item.quote.author}</Text>
          </View>
        </TouchableOpacity>
        
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
      <Text style={styles.headerTitle}>Mystical Journal</Text>
      <Text style={styles.headerSubtitle}>
        Your completed puzzles and their wisdom
      </Text>
      
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
      {shouldShowBanner() && (
        <AdBanner 
          type="banner" 
          style={styles.footerBannerAd}
        />
      )}
      <Text style={styles.footerText}>
        Complete more puzzles to unlock additional journal entries
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Journal Entries Yet</Text>
      <Text style={styles.emptyText}>
        Complete puzzles to unlock mystical wisdom and journal entries
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bb9d60" />
        <Text style={styles.loadingText}>Loading journal entries...</Text>
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
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPuzzle?.title}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <XIcon />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedPuzzle && (
                <>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: selectedPuzzle.completedGifUrl }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>
                      "{selectedPuzzle.quote.text}"
                    </Text>
                    <Text style={styles.quoteAuthor}>
                      — {selectedPuzzle.quote.author}
                    </Text>
                  </View>

                  <View style={styles.journalContainer}>
                    <Text style={styles.journalTitle}>
                      {selectedPuzzle.journalEntry.title}
                    </Text>
                    <Text style={styles.journalContent}>
                      {selectedPuzzle.journalEntry.content}
                    </Text>
                  </View>

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>About This Puzzle</Text>
                    <Text style={styles.descriptionText}>
                      {selectedPuzzle.description}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => selectedPuzzle && handleSaveImage(selectedPuzzle)}
              >
                <DownloadIcon />
                <Text style={styles.saveButtonText}>Save Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 80,
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
  puzzleCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#bb9d60',
  },
  puzzleImage: {
    width: '100%',
    height: 200,
  },
  puzzleInfo: {
    padding: 16,
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  puzzleQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  puzzleAuthor: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    opacity: 0.8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bb9d60',
    fontFamily: 'Rye',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  xIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xLine: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#333333',
    borderRadius: 1,
  },
  xLine1: {
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  quoteContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#bb9d60',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333333',
    marginBottom: 12,
    lineHeight: 26,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'right',
  },
  journalContainer: {
    margin: 20,
    marginTop: 0,
  },
  journalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  journalContent: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  descriptionContainer: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  downloadArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    position: 'absolute',
    top: 6,
    left: 4,
  },
  downloadLine: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 2,
    left: 2,
  },
});