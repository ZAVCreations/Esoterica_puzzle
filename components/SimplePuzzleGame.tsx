import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Puzzle } from '../types';
import CompletionModal from './CompletionModal';
import InterstitialAdManager from './InterstitialAdManager';
import { useAdManager } from '@/hooks/useAdManager';

interface SimplePiece {
  id: number;
  row: number;
  col: number;
  currentRow: number;
  currentCol: number;
  imageUrl: string;
}

interface SimplePuzzleGameProps {
  puzzle: Puzzle;
}

const SimplePuzzleGame: React.FC<SimplePuzzleGameProps> = ({ puzzle }) => {
  const [pieces, setPieces] = useState<SimplePiece[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const { 
    shouldShowInterstitial, 
    markInterstitialShown, 
    incrementPuzzlesSolved 
  } = useAdManager();
  
  const windowWidth = Dimensions.get('window').width;
  const gameWidth = Math.min(windowWidth - 40, 350);
  const cellSize = gameWidth / puzzle.gridSize;

  // Initialize puzzle pieces
  useEffect(() => {
    const initialPieces: SimplePiece[] = [];
    const positions = Array.from({ length: puzzle.gridSize * puzzle.gridSize }, (_, i) => i);
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    for (let row = 0; row < puzzle.gridSize; row++) {
      for (let col = 0; col < puzzle.gridSize; col++) {
        const id = row * puzzle.gridSize + col;
        const shuffledPosition = positions[id];
        const currentRow = Math.floor(shuffledPosition / puzzle.gridSize);
        const currentCol = shuffledPosition % puzzle.gridSize;
        
        initialPieces.push({
          id,
          row,
          col,
          currentRow,
          currentCol,
          imageUrl: puzzle.imageUrl
        });
      }
    }
    
    setPieces(initialPieces);
  }, [puzzle]);

  // Check if puzzle is complete
  const checkCompletion = (currentPieces: SimplePiece[]) => {
    return currentPieces.every(piece => 
      piece.row === piece.currentRow && piece.col === piece.currentCol
    );
  };

  // Handle piece selection and swapping
  const handlePiecePress = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Swap pieces
      const newPieces = pieces.map(piece => {
        if (piece.id === selectedPiece) {
          const targetPiece = pieces.find(p => p.id === pieceId);
          return {
            ...piece,
            currentRow: targetPiece!.currentRow,
            currentCol: targetPiece!.currentCol
          };
        } else if (piece.id === pieceId) {
          const selectedPieceData = pieces.find(p => p.id === selectedPiece);
          return {
            ...piece,
            currentRow: selectedPieceData!.currentRow,
            currentCol: selectedPieceData!.currentCol
          };
        }
        return piece;
      });
      
      setPieces(newPieces);
      setSelectedPiece(null);
      
      if (checkCompletion(newPieces)) {
        incrementPuzzlesSolved();
        
        // Check if we should show interstitial ad
        if (shouldShowInterstitial()) {
          setTimeout(() => {
            setShowInterstitialAd(true);
          }, 500);
        } else {
          setTimeout(() => setShowCompletionModal(true), 500);
        }
      }
    }
  };

  const resetPuzzle = () => {
    const positions = Array.from({ length: puzzle.gridSize * puzzle.gridSize }, (_, i) => i);
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    const newPieces = pieces.map((piece, index) => {
      const shuffledPosition = positions[index];
      return {
        ...piece,
        currentRow: Math.floor(shuffledPosition / puzzle.gridSize),
        currentCol: shuffledPosition % puzzle.gridSize
      };
    });
    
    setPieces(newPieces);
    setSelectedPiece(null);
    setShowCompletionModal(false);
    setShowInterstitialAd(false);
  };

  const handleInterstitialAdClosed = () => {
    setShowInterstitialAd(false);
    markInterstitialShown();
    setTimeout(() => setShowCompletionModal(true), 300);
  };

  const handleInterstitialAdError = (error: string) => {
    console.log('Interstitial ad error:', error);
    setShowInterstitialAd(false);
    setTimeout(() => setShowCompletionModal(true), 300);
  };

  const renderPiece = (piece: SimplePiece) => {
    const isSelected = selectedPiece === piece.id;
    const isCorrect = piece.row === piece.currentRow && piece.col === piece.currentCol;
    
    return (
      <TouchableOpacity
        key={piece.id}
        style={[
          styles.pieceContainer,
          {
            width: cellSize,
            height: cellSize,
            left: piece.currentCol * cellSize,
            top: piece.currentRow * cellSize,
          },
          isSelected && styles.selectedPiece,
          isCorrect && styles.correctPiece
        ]}
        onPress={() => handlePiecePress(piece.id)}
        activeOpacity={0.8}
      >
        <View style={styles.pieceImageContainer}>
          <Image
            source={{ uri: piece.imageUrl }}
            style={[
              styles.pieceImage,
              {
                width: gameWidth,
                height: gameWidth,
                transform: [
                  { translateX: -piece.col * cellSize },
                  { translateY: -piece.row * cellSize }
                ]
              }
            ]}
            resizeMode="cover"
          />
        </View>
        
        {isCorrect && (
          <View style={styles.correctIndicator}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{puzzle.title}</Text>
      <Text style={styles.instructions}>
        Tap pieces to select and swap them. Complete the puzzle!
      </Text>
      
      <View style={[styles.gameBoard, { width: gameWidth, height: gameWidth }]}>
        {pieces.map(renderPiece)}
      </View>
      
      <View style={styles.controls}>
        {selectedPiece !== null && (
          <TouchableOpacity 
            style={styles.deselectButton} 
            onPress={() => setSelectedPiece(null)}
          >
            <Text style={styles.deselectButtonText}>Deselect</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Interstitial Ad Manager */}
      <InterstitialAdManager
        shouldShow={showInterstitialAd}
        onAdClosed={handleInterstitialAdClosed}
        onAdError={handleInterstitialAdError}
      />
      
      {/* Interstitial Ad Preview Modal (for web/testing) */}
      <Modal
        visible={showInterstitialAd}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.interstitialContainer}>
          <View style={styles.interstitialContent}>
            <Text style={styles.interstitialTitle}>🎉 Congratulations!</Text>
            <Text style={styles.interstitialSubtitle}>You've completed another puzzle</Text>
            
            <View style={styles.testAdContainer}>
              <Text style={styles.testAdTitle}>TEST INTERSTITIAL AD</Text>
              <Text style={styles.testAdText}>
                This would be a full-screen advertisement
              </Text>
              <Text style={styles.testAdSubtext}>
                Revenue: High earning potential
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleInterstitialAdClosed}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <CompletionModal
        visible={showCompletionModal}
        puzzle={puzzle}
        onClose={() => setShowCompletionModal(false)}
        onReset={resetPuzzle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  gameBoard: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#bb9d60',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieceContainer: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#bb9d60',
    overflow: 'hidden',
  },
  selectedPiece: {
    borderColor: '#ff6b6b',
    borderWidth: 3,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  correctPiece: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  pieceImageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  pieceImage: {
    position: 'absolute',
  },
  correctIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  deselectButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deselectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  interstitialContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  interstitialContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  interstitialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  interstitialSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  testAdContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#bb9d60',
  },
  testAdTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bb9d60',
    marginBottom: 8,
  },
  testAdText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  testAdSubtext: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#bb9d60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimplePuzzleGame;