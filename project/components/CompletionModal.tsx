import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { Puzzle } from '../types';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface CompletionModalProps {
  visible: boolean;
  puzzle: Puzzle;
  onClose: () => void;
  onReset: () => void;
}

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

const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  puzzle,
  onClose,
  onReset
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  
  const handleSaveImage = async () => {
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
  
  const { width } = Dimensions.get('window');
  const imageSize = width * 0.8;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Puzzle Complete!</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XIcon />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: puzzle.completedGifUrl }}
                style={styles.completedImage}
                resizeMode="cover"
              />
            </View>
            
            <Text style={styles.puzzleTitle}>{puzzle.title}</Text>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{puzzle.description}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSaveImage}
            >
              <DownloadIcon />
              <Text style={styles.saveButtonText}>Save to Phone</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => {
                onReset();
                onClose();
              }}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Solve Again
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
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
  scrollContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
  },
  puzzleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#bb9d60',
  },
  descriptionText: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#bb9d60',
    shadowColor: '#bb9d60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#bb9d60',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#bb9d60',
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

export default CompletionModal;