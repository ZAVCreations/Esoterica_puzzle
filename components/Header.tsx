import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleBack = () => {
    router.back();
  };
  
  // Special case for main screens
  const isMainScreen = pathname === '/' || 
    pathname === '/gallery' || 
    pathname === '/journal';
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBackButton && !isMainScreen && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <ArrowLeft size={24} color="#E9D8FD" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E9D8FD',
  }
});

export default Header;