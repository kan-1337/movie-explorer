import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    // For web, we might need a different approach than Alert
    // since Alert might not work well in web environment
    const confirmLogout = async () => {
      try {
        console.log('User initiated logout');
        setIsLoading(true); // Show loading indicator
        
        // Perform logout
        await logout();
        
        console.log('Logout successful, navigating to Home');
        
        // Force navigation back to home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch (error: any) {
        console.error('Error during logout:', error);
        Alert.alert('Logout Error', error.message || 'Failed to logout. Please try again.');
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    };
    
    // Use platform-specific confirmation
    if (Platform.OS === 'web') {
      // For web, use a simple confirm dialog
      if (window.confirm('Are you sure you want to logout?')) {
        confirmLogout();
      }
    } else {
      // For mobile, use React Native Alert
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: confirmLogout }
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          You are not logged in
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Your Profile</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Username:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.username}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Account ID:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.id}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.disclaimer, { color: theme.colors.secondaryText }]}>
        This app uses The Movie Database API but is not endorsed or certified by TMDB.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    width: 100,
  },
  value: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  disclaimer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
  },
});
