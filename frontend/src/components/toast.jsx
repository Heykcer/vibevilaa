import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';









export default function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })]
      ).start();

      const timer = setTimeout(() => {
        Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic)
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic)
        })]
        ).start(() => {
          onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, opacity, translateY, onDismiss]);

  const animatedStyle = {
    opacity: opacity,
    transform: [{ translateY: translateY }]
  };

  const typeConfig = {
    success: {
      icon: '✓',
      color: AuthColors.success,
      bgColor: AuthColors.successLight
    },
    error: {
      icon: '✕',
      color: AuthColors.error,
      bgColor: AuthColors.errorLight
    },
    info: {
      icon: 'ℹ',
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    }
  };

  const config = typeConfig[type];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={onDismiss} activeOpacity={0.8}>
        <View
          style={[
          styles.toast,
          {
            backgroundColor: config.bgColor,
            borderLeftColor: config.color
          }]
          }>
          <ThemedText style={[styles.icon, { color: config.color }]}>{config.icon}</ThemedText>
          <ThemedText
            style={[styles.message, { color: config.color }]}
            numberOfLines={2}>
            {message}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Animated.View>);

}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing.four,
    left: Spacing.three,
    right: Spacing.three,
    zIndex: 1000
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8
  },
  icon: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: Spacing.two
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500'
  }
});