import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AdMobInterstitial } from 'expo-ads-admob';

// Test Interstitial Ad Unit ID
const TEST_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
  default: 'ca-app-pub-3940256099942544/1033173712'
});

interface InterstitialAdManagerProps {
  shouldShow: boolean;
  onAdClosed: () => void;
  onAdError: (error: string) => void;
}

const InterstitialAdManager: React.FC<InterstitialAdManagerProps> = ({
  shouldShow,
  onAdClosed,
  onAdError
}) => {
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Skip interstitial ads on web
      return;
    }

    // Set up interstitial ad
    AdMobInterstitial.setAdUnitID(TEST_INTERSTITIAL_ID);
    
    // Add event listeners
    AdMobInterstitial.addEventListener('interstitialDidLoad', () => {
      console.log('Interstitial ad loaded');
    });
    
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad', (error) => {
      console.log('Interstitial ad failed to load:', error);
      onAdError('Failed to load interstitial ad');
    });
    
    AdMobInterstitial.addEventListener('interstitialDidOpen', () => {
      console.log('Interstitial ad opened');
    });
    
    AdMobInterstitial.addEventListener('interstitialDidClose', () => {
      console.log('Interstitial ad closed');
      onAdClosed();
    });
    
    // Request ad
    AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
    
    return () => {
      // Clean up event listeners
      AdMobInterstitial.removeAllListeners();
    };
  }, []);
  
  useEffect(() => {
    if (shouldShow && Platform.OS !== 'web') {
      showInterstitialAd();
    }
  }, [shouldShow]);
  
  const showInterstitialAd = async () => {
    try {
      const isReady = await AdMobInterstitial.getIsReadyAsync();
      if (isReady) {
        await AdMobInterstitial.showAdAsync();
      } else {
        console.log('Interstitial ad not ready');
        onAdError('Interstitial ad not ready');
      }
    } catch (error) {
      console.log('Error showing interstitial ad:', error);
      onAdError('Error showing interstitial ad');
    }
  };
  
  return null; // This component doesn't render anything
};

export default InterstitialAdManager;