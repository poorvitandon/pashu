import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={[Colors.primary.saffron, Colors.primary.green]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Government Emblem Placeholder */}
        <View style={styles.emblemContainer}>
          <View style={styles.emblem}>
            <Text style={styles.emblemText}>🇮🇳</Text>
          </View>
        </View>

        {/* App Logo and Title */}
        <View style={styles.logoContainer}>
          <Text style={styles.appTitle}>P.A.S.H.U</Text>
          <Text style={styles.appSubtitle}>पशु</Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Smart Identification for{'\n'}Smarter Livestock Management
          </Text>
          <Text style={styles.taglineHindi}>
            स्मार्ट पहचान के लिए स्मार्ट पशुधन प्रबंधन
          </Text>
        </View>

        {/* Government Branding */}
        <View style={styles.brandingContainer}>
          <Text style={styles.brandingText}>Government of India</Text>
          <Text style={styles.brandingTextHindi}>भारत सरकार</Text>
          <Text style={styles.ministryText}>
            Ministry of Fisheries, Animal Husbandry & Dairying
          </Text>
        </View>

        {/* Digital India Logo */}
        <View style={styles.digitalIndiaContainer}>
          <Text style={styles.digitalIndiaText}>Digital India</Text>
          <Text style={styles.digitalIndiaTextHindi}>डिजिटल इंडिया</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emblemContainer: {
    marginBottom: Spacing.xl,
  },
  emblem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emblemText: {
    fontSize: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary.white,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 24,
    color: Colors.primary.white,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  tagline: {
    fontSize: 18,
    color: Colors.primary.white,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  taglineHindi: {
    fontSize: 16,
    color: Colors.secondary.cream,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandingText: {
    fontSize: 16,
    color: Colors.primary.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brandingTextHindi: {
    fontSize: 14,
    color: Colors.secondary.cream,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  ministryText: {
    fontSize: 12,
    color: Colors.secondary.cream,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  digitalIndiaContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  digitalIndiaText: {
    fontSize: 14,
    color: Colors.primary.white,
    fontWeight: 'bold',
  },
  digitalIndiaTextHindi: {
    fontSize: 12,
    color: Colors.secondary.cream,
    marginTop: 2,
  },
});