import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login, isLoading, error, clearError, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigation.replace('Home');
    }
  }, [user, navigation]);

  useEffect(() => {
    if (error) {
      setStatusMessage(`Error: ${error}`);
      Alert.alert('Login Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    try {
      if (!username.trim() || !password.trim()) {
        Alert.alert('Error', 'Please enter both username and password');
        return;
      }

      setStatusMessage('Attempting to login...');
      console.log('Attempting to login with username:', username);
      await login(username, password);
      setStatusMessage('Login successful!');
    } catch (err: any) {
      console.error('Login screen error:', err);
      setStatusMessage(`Login failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleCreateAccount = () => {
    // Open TMDB website in browser to create account
    Alert.alert(
      'Create Account',
      'You will be redirected to The Movie Database website to create an account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In a real app, you would use Linking.openURL here
            Alert.alert('Info', 'Please visit https://www.themoviedb.org/signup to create an account');
          } 
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Movie Explorer
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            Sign in with your TMDB account
          </Text>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Username"
              placeholderTextColor={theme.colors.secondaryText}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.secondaryText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {statusMessage ? (
            <Text style={[styles.statusMessage, { 
              color: statusMessage.includes('Error') || statusMessage.includes('failed') 
                ? '#ff3b30' 
                : statusMessage.includes('successful') 
                  ? '#34c759' 
                  : theme.colors.secondaryText 
            }]}>
              {statusMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
          >
            <Text style={[styles.createAccountText, { color: theme.colors.primary }]}>
              Don't have an account? Create one
            </Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: theme.colors.secondaryText }]}>
            This app uses The Movie Database API but is not endorsed or certified by TMDB.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  input: {
    padding: 15,
    fontSize: 16,
  },
  statusMessage: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    marginTop: 20,
    padding: 10,
  },
  createAccountText: {
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
  },
});
