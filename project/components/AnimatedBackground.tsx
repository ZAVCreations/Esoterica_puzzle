import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NUM_PARTICLES = 20;

interface Particle {
  size: Animated.Value;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  speed: number;
  delay: number;
}

const AnimatedBackground: React.FC = () => {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const { width, height } = Dimensions.get('window');
  
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      newParticles.push({
        size: new Animated.Value(Math.random() * 4 + 1),
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        opacity: new Animated.Value(Math.random() * 0.5 + 0.1),
        speed: Math.random() * 100 + 50,
        delay: Math.random() * 2000
      });
    }
    setParticles(newParticles);
    
    particles.forEach(particle => {
      animateParticle(particle, width, height);
    });
  }, []);
  
  const animateParticle = (particle: Particle, width: number, height: number) => {
    particle.y.addListener(({ value }) => {
      if (value > height) {
        particle.y.setValue(-20);
        particle.x.setValue(Math.random() * width);
      }
    });
    
    Animated.loop(
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.parallel([
          Animated.timing(particle.y, {
            toValue: height + 20,
            duration: 15000 / (particle.speed / 100),
            easing: Easing.linear,
            useNativeDriver: true
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.4,
              duration: 4000,
              useNativeDriver: true
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: 4000,
              useNativeDriver: true
            })
          ])
        ])
      ])
    ).start();
  };
  
  return (
    <View style={styles.container}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y }
              ]
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#D4AF37',
    borderRadius: 50,
  }
});

export default AnimatedBackground;