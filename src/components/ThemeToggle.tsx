import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={toggleTheme}
      activeOpacity={0.5} // More noticeable feedback
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area without changing visual size
    >
      <Text style={[styles.icon, { color: theme.colors.text }]}>
        {isDark ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  icon: {
    fontSize: 22,
  },
});
