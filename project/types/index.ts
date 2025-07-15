export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  completedGifUrl: string;
  gridSize: number;
  quote: {
    text: string;
    author: string;
  };
  journalEntry: {
    title: string;
    content: string;
  };
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  width: number;
  height: number;
  isPlaced: boolean;
  imageUrl: string;
  gridSize: number;
  clipPath: string;
}

export interface UserProgress {
  completedPuzzles: string[];
  unlockedJournalEntries: string[];
}