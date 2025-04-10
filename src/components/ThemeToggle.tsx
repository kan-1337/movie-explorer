import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Text style={[styles.icon, { color: theme.colors.text }]}>
        {isDark ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    fontSize: 20,
  },
});
