import React from 'react';
import { TouchableOpacity, StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';








export default function SocialButton({
  provider,
  onPress,
  loading = false,
  disabled = false
}) {
  const isDisabled = disabled || loading;
  const providerConfig = {
    google: {
      icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
      label: 'Continue with Google',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    apple: {
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg',
      label: 'Continue with Apple',
      bgColor: '#000000',
      textColor: '#FFFFFF'
    }
  };

  const config = providerConfig[provider];

  return (
    <TouchableOpacity
      style={[
      styles.button,
      { backgroundColor: config.bgColor },
      isDisabled && styles.disabled]
      }
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {loading ?
      <ActivityIndicator color={config.textColor} /> :

      <View style={styles.content}>
          <Image source={{ uri: config.icon }} style={styles.iconImage} resizeMode="contain" />
          <ThemedText style={[styles.text, { color: config.textColor }]}>
            {config.label}
          </ThemedText>
        </View>
      }
    </TouchableOpacity>);

}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.one,
    borderWidth: 1,
    borderColor: AuthColors.border
  },
  disabled: {
    opacity: 0.5
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: Spacing.two
  },
  text: {
    fontSize: 14,
    fontWeight: '500'
  }
});