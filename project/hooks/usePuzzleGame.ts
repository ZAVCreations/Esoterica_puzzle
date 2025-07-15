import { useState, useEffect } from 'react';
import { PuzzlePiece, Puzzle } from '../types';
import { 
  generatePuzzlePieces, 
  isPieceInCorrectPosition, 
  areAllPiecesPlaced,
  calculateBoardSize
} from '../utils/puzzleUtils';
import { completePuzzle } from '../utils/storage';

export const usePuzzleGame = (puzzle: Puzzle) => {
  const [boardSize, setBoardSize] = useState(calculateBoardSize(puzzle.gridSize));
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Initialize puzzle board
  useEffect(() => {
    if (puzzle) {
      const newPieces = generatePuzzlePieces(
        puzzle,
        boardSize.width,
        boardSize.height
      );
      setPieces(newPieces);
    }
  }, [puzzle, boardSize]);
  
  // Check for puzzle completion
  useEffect(() => {
    if (pieces.length > 0 && areAllPiecesPlaced(pieces) && !isComplete) {
      setIsComplete(true);
      setShowCompletionModal(true);
      completePuzzle(puzzle.id);
    }
  }, [pieces, isComplete, puzzle.id]);
  
  // Handle piece movement
  const movePiece = (pieceId: number, newX: number, newY: number) => {
    setPieces(currentPieces => {
      return currentPieces.map(piece => {
        if (piece.id === pieceId) {
          const updatedPiece = { ...piece, x: newX, y: newY };
          
          // Check if piece is close to its correct position
          const isCorrect = isPieceInCorrectPosition(updatedPiece);
          
          // If it's close enough, snap it to the correct position
          if (isCorrect && !piece.isPlaced) {
            return {
              ...updatedPiece,
              x: piece.correctX,
              y: piece.correctY,
              isPlaced: true
            };
          }
          
          return updatedPiece;
        }
        return piece;
      });
    });
  };
  
  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };
  
  const resetPuzzle = () => {
    const newPieces = generatePuzzlePieces(
      puzzle,
      boardSize.width,
      boardSize.height
    );
    setPieces(newPieces);
    setIsComplete(false);
  };
  
  return {
    pieces,
    boardSize,
    isComplete,
    showCompletionModal,
    movePiece,
    closeCompletionModal,
    resetPuzzle
  };
};