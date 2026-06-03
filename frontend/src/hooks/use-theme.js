import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export function useTheme() {
  // Always use the dark blue VibeVilla theme to match the requested premium night mode.
  return Colors.dark;
}
