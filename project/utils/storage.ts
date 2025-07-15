import AsyncStorage from '@react-native-async-storage/async-storage';
import { Puzzle, UserProgress } from '../types';
import { allPuzzles } from './puzzleData';

// Default progress with first puzzles unlocked
const defaultProgress: UserProgress = {
  completedPuzzles: [],
  unlockedJournalEntries: []
};

// Load user progress from storage
export const loadUserProgress = async (): Promise<UserProgress> => {
  try {
    const storedProgress = await AsyncStorage.getItem('esoterica-progress');
    if (storedProgress) {
      return JSON.parse(storedProgress);
    }
    return defaultProgress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return defaultProgress;
  }
};

// Save user progress to storage
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem('esoterica-progress', JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Get puzzles with user progress applied
export const getPuzzlesWithProgress = async (): Promise<Puzzle[]> => {
  try {
    const progress = await loadUserProgress();
    
    return allPuzzles.map(puzzle => ({
      ...puzzle,
      isCompleted: progress.completedPuzzles.includes(puzzle.id),
      isUnlocked: 
        puzzle.isUnlocked || 
        progress.completedPuzzles.includes(puzzle.id) ||
        // Unlock next 3 puzzles after each completion
        allPuzzles
          .filter(p => progress.completedPuzzles.includes(p.id))
          .some(p => parseInt(puzzle.id) <= parseInt(p.id) + 3)
    }));
  } catch (error) {
    console.error('Failed to get puzzles with progress:', error);
    return allPuzzles;
  }
};

// Mark puzzle as completed
export const completePuzzle = async (puzzleId: string): Promise<void> => {
  try {
    const progress = await loadUserProgress();
    if (!progress.completedPuzzles.includes(puzzleId)) {
      progress.completedPuzzles.push(puzzleId);
      progress.unlockedJournalEntries.push(puzzleId);
      await saveUserProgress(progress);
    }
  } catch (error) {
    console.error('Failed to complete puzzle:', error);
  }
};

// Check if puzzle is completed
export const isPuzzleCompleted = async (puzzleId: string): Promise<boolean> => {
  try {
    const progress = await loadUserProgress();
    return progress.completedPuzzles.includes(puzzleId);
  } catch (error) {
    console.error('Failed to check if puzzle is completed:', error);
    return false;
  }
};