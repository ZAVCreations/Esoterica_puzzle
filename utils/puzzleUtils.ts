import { PuzzlePiece, Puzzle } from '../types';

export const generatePuzzlePieces = (
  puzzle: Puzzle,
  boardWidth: number,
  boardHeight: number
): PuzzlePiece[] => {
  const { gridSize, imageUrl } = puzzle;
  const pieces: PuzzlePiece[] = [];
  
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = row * gridSize + col;
      const correctX = col * pieceWidth;
      const correctY = row * pieceHeight;
      
      // Scatter pieces randomly but keep them visible
      const randomX = Math.random() * (boardWidth - pieceWidth);
      const randomY = Math.random() * (boardHeight - pieceHeight);
      
      pieces.push({
        id,
        x: randomX,
        y: randomY,
        correctX,
        correctY,
        width: pieceWidth,
        height: pieceHeight,
        isPlaced: false,
        imageUrl,
        gridSize,
        clipPath: `inset(${row * 100 / gridSize}% ${100 - (col + 1) * 100 / gridSize}% ${100 - (row + 1) * 100 / gridSize}% ${col * 100 / gridSize}%)`
      });
    }
  }
  
  return pieces;
};

export const isPieceInCorrectPosition = (piece: PuzzlePiece): boolean => {
  const tolerance = 40; // Generous tolerance for kids
  const distanceX = Math.abs(piece.x - piece.correctX);
  const distanceY = Math.abs(piece.y - piece.correctY);
  return distanceX <= tolerance && distanceY <= tolerance;
};

export const areAllPiecesPlaced = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every(piece => isPieceInCorrectPosition(piece));
};

export const calculateBoardSize = (gridSize: number) => {
  const minSize = 300;
  const maxSize = 400;
  const size = Math.max(minSize, Math.min(maxSize, gridSize * 120));
  
  return {
    width: size,
    height: size
  };
};