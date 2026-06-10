import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Easing, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/use-theme';
import { Fonts, Spacing } from '../constants/theme';
import logoGlow from '../../assets/images/logo-glow.png';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const theme = useTheme();
  const [isExitAnimationStarted, setIsExitAnimationStarted] = useState(false);

  // Animation state values
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(25)).current;
  const textTracking = useRef(new Animated.Value(2)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const splashScale = useRef(new Animated.Value(1)).current;

  // Status updates simulation
  const [statusText, setStatusText] = useState('INITIALIZING NEON EDEN...');

  useEffect(() => {
    // Pulse animation loop running independently so it doesn't block the sequence completion
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 0.98,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Dynamic status text update triggers
    const timers = [
      setTimeout(() => setStatusText('SYNCING LIVE REDIS COUNTERS...'), 600),
      setTimeout(() => setStatusText('ESTABLISHING SECURE PROTOCOLS...'), 1200),
      setTimeout(() => setStatusText('VIBES FULLY CHARGED! ⚡'), 1800),
      setTimeout(() => setIsExitAnimationStarted(true), 2800),
    ];

    // Start pulsing loop
    pulseAnim.start();

    // Master animation sequence
    Animated.sequence([
      // 1. Logo entry spring and text slide-up concurrently
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1.0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1.0,
          duration: 600,
          delay: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 650,
          delay: 200,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(textTracking, {
          toValue: 6,
          duration: 800,
          delay: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false, // letterSpacing doesn't support native driver in RN
        }),
        Animated.timing(progressOpacity, {
          toValue: 1,
          duration: 300,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),

      // 2. Start progress bar loading
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, // width style animation doesn't support native driver
      }),

      // Delay briefly at 100% load
      Animated.delay(200),

      // 3. Zoom out portal effect and fade out splash screen
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 450,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(splashScale, {
          toValue: 1.15,
          duration: 500,
          easing: Easing.in(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Clear timers
      timers.forEach((t) => clearTimeout(t));
      // Stop loop animation
      pulseAnim.stop();
      // Notify parent that splash is complete
      if (onFinish) {
        onFinish();
      }
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      pulseAnim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interpolated widths/animations
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const combinedLogoScale = Animated.multiply(logoScale, pulseScale);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity: splashOpacity,
          transform: [{ scale: splashScale }],
        },
      ]}
    >
      <StatusBar hidden={!isExitAnimationStarted} />
      <View style={styles.centerContainer}>
        {/* Glow Ring Behind Logo */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              borderColor: theme.accent,
              opacity: logoOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [{ scale: pulseScale }],
            },
          ]}
        />

        {/* Brand Logo */}
        <Animated.Image
          source={logoGlow}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: combinedLogoScale }],
            },
          ]}
          resizeMode="contain"
        />

        {/* Brand Titles */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
          }}
        >
          <Animated.Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontFamily: Fonts.sans,
                letterSpacing: textTracking,
              },
            ]}
          >
            VIBE VILLA
          </Animated.Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.textSecondary,
                fontFamily: Fonts.sans,
              },
            ]}
          >
            ANIME AVATAR REALITY SHOW
          </Text>
        </Animated.View>
      </View>

      {/* Cyberpunk Loading Progress Area */}
      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: progressOpacity,
          },
        ]}
      >
        <Text style={[styles.statusText, { color: theme.accent }]}>{statusText}</Text>

        <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundElement }]}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressWidth,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>

        <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
          VIBE CHECK PASS: SECURE & ENCRYPTED
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: width * 0.48,
    height: width * 0.48,
    maxWidth: 220,
    maxHeight: 220,
    marginBottom: Spacing.four,
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    maxWidth: 280,
    maxHeight: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    top: height * 0.22,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.one,
    ...Platform.select({
      web: {
        textShadow: '0 0 15px rgba(255, 107, 53, 0.4)',
      },
    }),
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  footerContainer: {
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  disclaimer: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
