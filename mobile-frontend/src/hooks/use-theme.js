import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeName, setThemeName] = useState(deviceTheme === 'light' ? 'light' : 'dark');

  const theme = themeName === 'light' ? Colors.light : Colors.dark;

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context) {
    return context.theme;
  }
  return Colors.dark;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
