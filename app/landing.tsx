import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AdBanner from '@/components/AdBanner';
import { useAdManager } from '@/hooks/useAdManager';

export default function LandingScreen() {
  const router = useRouter();
  const { shouldShowBanner } = useAdManager();
  
  const handleEnter = () => {
    router.push('/(tabs)');
  };
  
  const handleExit = () => {
    // Close the app window (web only)
    if (typeof window !== 'undefined') {
      window.close();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://d2vfmc14ehtaht.cloudfront.net/711c61a52261018e62/fb4a3d5930bebc267c723716b747b12ff7d02b78.jpg?format=webp' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleEnter}
          >
            <Text style={styles.buttonText}>Enter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleExit}
          >
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
        
        {/* Optional banner ad at bottom */}
        {shouldShowBanner() && (
          <View style={styles.adContainer}>
            <AdBanner type="banner" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -60, // Move image up
  },
  logo: {
    width: '104%', // Increased from 99% to 104% (5% increase)
    height: 462, // Increased from 440 to 462 (5% increase)
    maxHeight: '92%', // Increased from 88% to 92% (5% increase)
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Rye',
  },
  adContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});