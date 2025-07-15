import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import AnimatedBackground from '@/components/AnimatedBackground';
import Sidebar from '@/components/Sidebar';
import { Chrome as Home, BookOpen } from 'lucide-react-native';

export default function TabLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // Custom menu icon component to avoid lucide-react-native web issues
  const MenuIcon = () => (
    <View style={styles.menuIcon}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#bb9d60',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: styles.tabBarLabel,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setIsSidebarVisible(true)}
            >
              <MenuIcon />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Puzzles',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color, size }) => (
              <BookOpen size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      
      <Sidebar 
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: 'rgba(187, 157, 96, 0.3)',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1000,
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#bb9d60',
    borderRadius: 1.5,
  },
});