import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { MovieDetailsScreen } from './src/screens/MovieDetailsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RootStackParamList } from './src/navigation/types';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeToggle } from './src/components/ThemeToggle';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainApp() {
  const { theme, isDark } = useTheme();
  
  // Customize navigation theme
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background, // This controls the screen background
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };
  
  // Log the theme to verify it's being applied correctly
  console.log('Current theme background:', theme.colors.background);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: 'Movie Explorer',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                  style={{ 
                    marginRight: 15, 
                    padding: 10, // Add padding to increase touch area
                    backgroundColor: theme.colors.card,
                    borderRadius: 8
                  }}
                  onPress={() => navigation.navigate('Profile')}
                  activeOpacity={0.7} // Add feedback when pressed
                >
                  <Text style={{ fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' }}>Profile</Text>
                </TouchableOpacity>
                <ThemeToggle />
              </View>
            )
          })}
        />
        <Stack.Screen 
          name="MovieDetails" 
          component={MovieDetailsScreen}
          options={{ title: 'Movie Details' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Your Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
