import React, { useEffect } from 'react';
import { 
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Platform,
  View
} from 'react-native';
import { PuzzlePiece as PuzzlePieceType } from '../types';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  onMove: (id: number, x: number, y: number) => void;
  boardX: number;
  boardY: number;
  isInPiecesArea?: boolean;
}

const SNAP_THRESHOLD = 40; // Easier snapping for kids

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ 
  piece, 
  onMove, 
  boardX, 
  boardY, 
  isInPiecesArea = false 
}) => {
  const pan = React.useRef(new Animated.ValueXY({ x: piece.x, y: piece.y })).current;
  const opacity = React.useRef(new Animated.Value(1)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  // Check if piece is in correct position
  const isCorrectPosition = () => {
    const distanceX = Math.abs(piece.x - piece.correctX);
    const distanceY = Math.abs(piece.y - piece.correctY);
    return distanceX <= SNAP_THRESHOLD && distanceY <= SNAP_THRESHOLD;
  };

  // Update visual feedback based on position
  useEffect(() => {
    const isCorrect = isCorrectPosition();
    
    Animated.timing(opacity, {
      toValue: isCorrect ? 1 : 0.9,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [piece.x, piece.y, piece.correctX, piece.correctY]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Lift piece when touched
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.1,
            useNativeDriver: false,
            friction: 5,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: false,
            friction: 5,
          })
        ]).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        const currentX = piece.x + gesture.dx;
        const currentY = piece.y + gesture.dy;
        
        const distanceX = Math.abs(currentX - piece.correctX);
        const distanceY = Math.abs(currentY - piece.correctY);
        
        if (distanceX < SNAP_THRESHOLD && distanceY < SNAP_THRESHOLD) {
          // Snap to correct position with celebration
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: piece.correctX, y: piece.correctY },
              useNativeDriver: false,
              friction: 6,
              tension: 50
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              friction: 4
            }),
            // Celebration pulse
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: false,
              }),
              Animated.timing(scale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
              })
            ])
          ]).start();
          onMove(piece.id, piece.correctX, piece.correctY);
        } else {
          // Return to current position
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: currentX, y: currentY },
              useNativeDriver: false,
              friction: 5,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              friction: 5,
            })
          ]).start();
          onMove(piece.id, currentX, currentY);
        }
      },
    })
  ).current;

  const pieceStyle = {
    position: 'absolute',
    width: piece.width,
    height: piece.height,
    opacity,
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { scale }
    ],
    zIndex: isInPiecesArea ? 5 : 10,
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.piece, pieceStyle]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: piece.imageUrl }}
          style={[
            styles.image,
            {
              width: piece.width * piece.gridSize,
              height: piece.height * piece.gridSize,
              transform: [
                { translateX: -piece.correctX },
                { translateY: -piece.correctY }
              ]
            }
          ]}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#bb9d60',
    borderRadius: 6,
    shadowColor: '#bb9d60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        cursor: 'grab',
        ':active': {
          cursor: 'grabbing'
        }
      }
    })
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute'
  }
});

export default PuzzlePiece;