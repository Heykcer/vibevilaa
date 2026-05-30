import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Color System Constants
const COLORS = {
  primary: '#1A2544',      // Deep Navy Blue
  white: '#FFFFFF',         // Crisp White
  accentOrange: '#FF6B35',  // Vibrant Orange
  accentTeal: '#4ECDC4',    // Vibrant Teal
  accentYellow: '#FFE66D',  // Vibrant Yellow
  lightGray: '#F5F5F5',     // Light Gray
  darkText: '#2C3E50',      // Dark Text
  lightText: '#FFFFFF',     // Light Text
};

interface BlankComponentProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

/**
 * BlankComponent - A template component following Vibe Villa design system
 * 
 * Design Features:
 * - Deep navy background with white card surface
 * - Vibrant accent colors for interactive elements
 * - Clean spacing and typography hierarchy
 * - Professional and trustworthy appearance
 */
export const BlankComponent: React.FC<BlankComponentProps> = ({
  title = 'Component Title',
  subtitle = 'Component Subtitle',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Card Container */}
      <View style={styles.card}>
        {/* Header Section - Deep Navy Background */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Content Section - Crisp White Background */}
        <View style={styles.content}>
          <Text style={styles.bodyText}>
            Add your content here. The design system ensures consistency
            and a professional appearance across all components.
          </Text>

          {/* Accent Color Showcase */}
          <View style={styles.accentRow}>
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentOrange }]} />
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentTeal }]} />
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentYellow }]} />
          </View>
        </View>

        {/* Action Button - Vibrant Accent */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Action Button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Deep Navy Blue
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.white, // Crisp White
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    backgroundColor: COLORS.primary, // Deep Navy Background
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white, // Light Text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.8,
  },
  content: {
    padding: 20,
    backgroundColor: COLORS.white, // Crisp White
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.darkText, // Dark Text
    marginBottom: 20,
  },
  accentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  accentBox: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  actionButton: {
    backgroundColor: COLORS.accentOrange, // Vibrant Orange Accent
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default BlankComponent;
