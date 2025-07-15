import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdConfig {
  showInterstitialAfterPuzzles: number;
  showBannerAds: boolean;
  showNativeAds: boolean;
  adFrequency: 'low' | 'medium' | 'high';
  interstitialCooldown: number; // milliseconds
}

const defaultAdConfig: AdConfig = {
  showInterstitialAfterPuzzles: 3, // Every 3 puzzle completions
  showBannerAds: true,
  showNativeAds: true,
  adFrequency: 'medium',
  interstitialCooldown: 300000, // 5 minutes
};

export const useAdManager = () => {
  const [adConfig, setAdConfig] = useState<AdConfig>(defaultAdConfig);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [lastInterstitialShown, setLastInterstitialShown] = useState(0);
  const [lastInterstitialTime, setLastInterstitialTime] = useState(0);

  useEffect(() => {
    loadAdConfig();
    loadPuzzleProgress();
  }, []);

  const loadAdConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem('ad-config');
      if (stored) {
        setAdConfig({ ...defaultAdConfig, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load ad config:', error);
    }
  };

  const loadPuzzleProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem('esoterica-progress');
      const adData = await AsyncStorage.getItem('ad-data');
      
      if (progress) {
        const parsed = JSON.parse(progress);
        setPuzzlesSolved(parsed.completedPuzzles?.length || 0);
      }
      
      if (adData) {
        const parsed = JSON.parse(adData);
        setLastInterstitialShown(parsed.lastInterstitialShown || 0);
        setLastInterstitialTime(parsed.lastInterstitialTime || 0);
      }
    } catch (error) {
      console.error('Failed to load puzzle progress:', error);
    }
  };

  const shouldShowInterstitial = (): boolean => {
    const puzzlesSinceLastAd = puzzlesSolved - lastInterstitialShown;
    const timeSinceLastAd = Date.now() - lastInterstitialTime;
    
    return (
      puzzlesSinceLastAd >= adConfig.showInterstitialAfterPuzzles &&
      timeSinceLastAd >= adConfig.interstitialCooldown
    );
  };

  const shouldShowBanner = (): boolean => {
    return adConfig.showBannerAds;
  };

  const shouldShowNativeAd = (position: number): boolean => {
    if (!adConfig.showNativeAds) return false;
    
    // Show native ads every 6 puzzles in grid
    return position > 0 && position % 6 === 0;
  };

  const markInterstitialShown = async () => {
    const newCount = puzzlesSolved;
    const currentTime = Date.now();
    
    setLastInterstitialShown(newCount);
    setLastInterstitialTime(currentTime);
    
    try {
      await AsyncStorage.setItem('ad-data', JSON.stringify({
        lastInterstitialShown: newCount,
        lastInterstitialTime: currentTime
      }));
    } catch (error) {
      console.error('Failed to save ad data:', error);
    }
  };

  const incrementPuzzlesSolved = async () => {
    const newCount = puzzlesSolved + 1;
    setPuzzlesSolved(newCount);
  };

  const getAdFrequencyMultiplier = (): number => {
    switch (adConfig.adFrequency) {
      case 'low': return 1.5;
      case 'high': return 0.7;
      default: return 1;
    }
  };

  return {
    adConfig,
    shouldShowInterstitial,
    shouldShowBanner,
    shouldShowNativeAd,
    markInterstitialShown,
    incrementPuzzlesSolved,
    getAdFrequencyMultiplier,
    puzzlesSolved,
    lastInterstitialShown,
  };
};