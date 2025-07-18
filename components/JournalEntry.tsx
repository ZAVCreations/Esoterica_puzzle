import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import { Puzzle } from '../types';
import { ChevronDown } from 'lucide-react-native';

interface JournalEntryProps {
  puzzle: Puzzle;
  expanded?: boolean;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ 
  puzzle, 
  expanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const rotateAnim = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const heightAnim = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;
  
  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
    
    setIsExpanded(!isExpanded);
  };
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  
  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300]
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.entryTitle}>{puzzle.journalEntry.title}</Text>
          <Text style={styles.puzzleTitle}>
            From: {puzzle.title}
          </Text>
        </View>
        
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={20} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.contentContainer,
          { maxHeight: Platform.OS === 'web' ? (isExpanded ? 'none' : 0) : maxHeight },
          Platform.OS !== 'web' && { overflow: 'hidden' }
        ]}
      >
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{puzzle.quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {puzzle.quote.author}</Text>
        </View>
        
        <Text style={styles.entryContent}>
          {puzzle.journalEntry.content}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#bb9d60',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  puzzleTitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quoteContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(76, 29, 149, 0.3)',
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#bb9d60',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  entryContent: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  }
});

export default JournalEntry;