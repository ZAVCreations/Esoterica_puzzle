import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Puzzle } from '../types';
import PuzzlePiece from './PuzzlePiece';
import CompletionModal from './CompletionModal';
import { generatePuzzlePieces, areAllPiecesPlaced } from '../utils/puzzleUtils';

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onComplete?: () => void;
  showPiecesOnly?: boolean;
  showBoardOnly?: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ 
  puzzle, 
  onComplete, 
  showPiecesOnly = false, 
  showBoardOnly = false 
}) => {
  const [pieces, setPieces] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const boardSize = Math.min(windowWidth * 0.85, 350);
  
  useEffect(() => {
    const initialPieces = generatePuzzlePieces(puzzle, boardSize, boardSize);
    setPieces(initialPieces);
  }, [puzzle, boardSize]);

  const handlePieceMove = (id: number, x: number, y: number) => {
    const newPieces = pieces.map(piece => {
      if (piece.id === id) {
        return { ...piece, x, y };
      }
      return piece;
    });
    
    setPieces(newPieces);
    
    if (areAllPiecesPlaced(newPieces)) {
      setShowCompletionModal(true);
      if (onComplete) onComplete();
    }
  };

  const resetPuzzle = () => {
    const newPieces = generatePuzzlePieces(puzzle, boardSize, boardSize);
    setPieces(newPieces);
    setShowCompletionModal(false);
  };

  // Show only scattered pieces - smaller size for pieces area
  if (showPiecesOnly) {
    return (
      <View style={styles.piecesOnlyContainer}>
        <View style={[styles.piecesArea, { width: boardSize, height: 100 }]}>
          {pieces.map(piece => (
            <PuzzlePiece
              key={piece.id}
              piece={{
                ...piece,
                width: piece.width * 0.4, // Much smaller pieces
                height: piece.height * 0.4,
                x: (piece.x * 0.3) % (boardSize - 60), // Keep within container
                y: (piece.y * 0.3) % 80, // Keep within height
              }}
              onMove={handlePieceMove}
              boardX={0}
              boardY={0}
              isInPiecesArea={true}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetPuzzle}>
          <Text style={styles.resetButtonText}>Reset Pieces</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show only the puzzle board (3x3 grid)
  if (showBoardOnly) {
    return (
      <View style={styles.boardOnlyContainer}>
        <Text style={styles.instructionText}>Drag pieces from above to complete the puzzle</Text>
        
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {/* White background for puzzle area */}
          <View style={[styles.puzzleBackground, { width: boardSize, height: boardSize }]} />
          
          {/* Grid lines for guidance */}
          <View style={styles.gridContainer}>
            {Array.from({ length: puzzle.gridSize + 1 }).map((_, index) => (
              <React.Fragment key={`grid-${index}`}>
                {/* Vertical lines */}
                <View 
                  style={[
                    styles.gridLine,
                    styles.verticalLine,
                    { 
                      left: (index * boardSize) / puzzle.gridSize,
                      height: boardSize 
                    }
                  ]} 
                />
                {/* Horizontal lines */}
                <View 
                  style={[
                    styles.gridLine,
                    styles.horizontalLine,
                    { 
                      top: (index * boardSize) / puzzle.gridSize,
                      width: boardSize 
                    }
                  ]} 
                />
              </React.Fragment>
            ))}
          </View>
          
          {/* Show pieces that are placed on the board */}
          {pieces
            .filter(piece => {
              const distanceX = Math.abs(piece.x - piece.correctX);
              const distanceY = Math.abs(piece.y - piece.correctY);
              return distanceX <= 40 && distanceY <= 40; // Only show pieces close to correct position
            })
            .map(piece => (
              <PuzzlePiece
                key={piece.id}
                piece={piece}
                onMove={handlePieceMove}
                boardX={0}
                boardY={0}
                isInPiecesArea={false}
              />
            ))}
        </View>

        <CompletionModal
          visible={showCompletionModal}
          puzzle={puzzle}
          onClose={() => setShowCompletionModal(false)}
          onReset={resetPuzzle}
        />
      </View>
    );
  }

  // Default: Show both pieces and board (original behavior)
  return (
    <View style={styles.fullPuzzleContainer}>
      <View style={styles.container}>
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {/* White background for puzzle area */}
          <View style={[styles.puzzleBackground, { width: boardSize, height: boardSize }]} />
          
          {/* Grid lines for guidance */}
          <View style={styles.gridContainer}>
            {Array.from({ length: puzzle.gridSize + 1 }).map((_, index) => (
              <React.Fragment key={`grid-${index}`}>
                {/* Vertical lines */}
                <View 
                  style={[
                    styles.gridLine,
                    styles.verticalLine,
                    { 
                      left: (index * boardSize) / puzzle.gridSize,
                      height: boardSize 
                    }
                  ]} 
                />
                {/* Horizontal lines */}
                <View 
                  style={[
                    styles.gridLine,
                    styles.horizontalLine,
                    { 
                      top: (index * boardSize) / puzzle.gridSize,
                      width: boardSize 
                    }
                  ]} 
                />
              </React.Fragment>
            ))}
          </View>
          
          {pieces.map(piece => (
            <PuzzlePiece
              key={piece.id}
              piece={piece}
              onMove={handlePieceMove}
              boardX={0}
              boardY={0}
              isInPiecesArea={false}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetPuzzle}>
          <Text style={styles.resetButtonText}>Reset Puzzle</Text>
        </TouchableOpacity>

        <CompletionModal
          visible={showCompletionModal}
          puzzle={puzzle}
          onClose={() => setShowCompletionModal(false)}
          onReset={resetPuzzle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullPuzzleContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  piecesOnlyContainer: {
    backgroundColor: 'rgba(187, 157, 96, 0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: 'rgba(187, 157, 96, 0.3)',
  },
  piecesArea: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: 'rgba(187, 157, 96, 0.5)',
    marginBottom: 10,
  },
  boardOnlyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  board: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  puzzleBackground: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#bb9d60',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(187, 157, 96, 0.3)',
  },
  verticalLine: {
    width: 2,
  },
  horizontalLine: {
    height: 2,
  },
  resetButton: {
    marginTop: 15,
    backgroundColor: '#bb9d60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PuzzleBoard;