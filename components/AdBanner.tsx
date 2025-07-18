import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded 
} from 'expo-ads-admob';

interface AdBannerProps {
  type: 'banner' | 'native' | 'interstitial-preview';
  onPress?: () => void;
  style?: any;
}

// Test Ad Unit IDs (these work in development)
const TEST_AD_UNITS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
    default: 'ca-app-pub-3940256099942544/6300978111'
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
    default: 'ca-app-pub-3940256099942544/1033173712'
  }),
  native: Platform.select({
    ios: 'ca-app-pub-3940256099942544/3986624511',
    android: 'ca-app-pub-3940256099942544/2247696110',
    default: 'ca-app-pub-3940256099942544/2247696110'
  })
};

const AdBanner: React.FC<AdBannerProps> = ({ type, onPress, style }) => {
  const [adError, setAdError] = useState<string | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  const handleAdFailedToLoad = (error: any) => {
    console.log('Ad failed to load:', error);
    setAdError('Ad failed to load');
  };

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(null);
  };

  const renderBannerAd = () => {
    if (Platform.OS === 'web') {
      // Fallback for web - show mock ad
      return (
        <TouchableOpacity style={[styles.bannerAd, style]} onPress={onPress}>
          <View style={styles.adContent}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300&h=100&fit=crop' }}
              style={styles.adImage}
            />
            <View style={styles.adText}>
              <Text style={styles.adTitle}>Test Banner Ad</Text>
              <Text style={styles.adSubtitle}>This is a test advertisement</Text>
            </View>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>Ad</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.bannerContainer, style]}>
        {adError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Ad Error: {adError}</Text>
          </View>
        ) : (
          <AdMobBanner
            bannerSize="banner"
            adUnitID={TEST_AD_UNITS.banner}
            servePersonalizedAds={false}
            onDidFailToReceiveAdWithError={handleAdFailedToLoad}
            onAdViewDidReceiveAd={handleAdLoaded}
            style={styles.admobBanner}
          />
        )}
      </View>
    );
  };

  const renderNativeAd = () => (
    <View style={[styles.nativeAd, style]}>
      <View style={styles.adHeader}>
        <Text style={styles.sponsoredText}>Sponsored</Text>
      </View>
      <TouchableOpacity style={styles.nativeContent} onPress={onPress}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }}
          style={styles.nativeImage}
        />
        <View style={styles.nativeTextContainer}>
          <Text style={styles.nativeTitle}>Test Native Ad</Text>
          <Text style={styles.nativeDescription}>
            This is a test native advertisement that blends with your content.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderInterstitialPreview = () => (
    <View style={[styles.interstitialPreview, style]}>
      <Text style={styles.interstitialText}>Test Interstitial Ad</Text>
      <Text style={styles.interstitialSubtext}>This would be a full-screen ad</Text>
    </View>
  );

  switch (type) {
    case 'banner':
      return renderBannerAd();
    case 'native':
      return renderNativeAd();
    case 'interstitial-preview':
      return renderInterstitialPreview();
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 157, 96, 0.3)',
    minHeight: 50,
    justifyContent: 'center',
  },
  admobBanner: {
    alignSelf: 'center',
  },
  errorContainer: {
    padding: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
  },
  bannerAd: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 157, 96, 0.3)',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  adImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  adText: {
    flex: 1,
  },
  adTitle: {
    color: '#bb9d60',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  adSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  adBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(187, 157, 96, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  nativeAd: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  adHeader: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sponsoredText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  nativeContent: {
    padding: 16,
  },
  nativeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  nativeTextContainer: {
    gap: 8,
  },
  nativeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nativeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#bb9d60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  interstitialPreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  interstitialText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  interstitialSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default AdBanner;