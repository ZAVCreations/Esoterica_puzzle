import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

// Custom X icon component to avoid lucide-react-native web issues
const XIcon = () => (
  <View style={styles.xIcon}>
    <View style={[styles.xLine, styles.xLine1]} />
    <View style={[styles.xLine, styles.xLine2]} />
  </View>
);

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <Animated.View 
      style={[
        styles.overlay,
        { display: isVisible ? 'flex' : 'none' }
      ]}
    >
      <TouchableOpacity 
        style={styles.overlayTouchable} 
        onPress={onClose} 
        activeOpacity={1}
      />
      
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XIcon />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={[
              styles.menuItem,
              pathname === '/landing' && styles.activeMenuItem
            ]}
            onPress={() => {
              router.push('/landing');
              onClose();
            }}
          >
            <Text style={[
              styles.menuText,
              pathname === '/landing' && styles.activeMenuText
            ]}>
              Home
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.menuItem,
              pathname === '/(tabs)' && styles.activeMenuItem
            ]}
            onPress={() => {
              router.push('/(tabs)');
              onClose();
            }}
          >
            <Text style={[
              styles.menuText,
              pathname === '/(tabs)' && styles.activeMenuText
            ]}>
              Puzzles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#000000',
    paddingTop: 40,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(187, 157, 96, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  xIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xLine: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#bb9d60',
    borderRadius: 1,
  },
  xLine1: {
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  activeMenuItem: {
    backgroundColor: '#bb9d60',
  },
  menuText: {
    fontFamily: 'Rye',
    fontSize: 18,
    color: '#FFFFFF',
  },
  activeMenuText: {
    color: '#FFFFFF',
  },
});

export default Sidebar;