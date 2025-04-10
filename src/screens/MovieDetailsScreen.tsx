import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MovieDetails } from '../types/movie';
import { getMovieDetails, getImageUrl } from '../services/movieService';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RatingInput } from '../components/RatingInput';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

export const MovieDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { movie } = route.params;
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
  }, []);

  const loadMovieDetails = async () => {
    try {
      const movieDetails = await getMovieDetails(movie.id);
      setDetails(movieDetails);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.loading} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image
        style={styles.backdrop}
        source={{
          uri: getImageUrl(movie.backdrop_path || movie.poster_path),
        }}
      />
      <View style={[styles.content, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{movie.title}</Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: theme.colors.rating }]}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={[styles.votes, { color: theme.colors.secondaryText }]}>({movie.vote_count} votes)</Text>
        </View>
        <Text style={[styles.releaseDate, { color: theme.colors.secondaryText }]}>
          Release Date: {movie.release_date}
        </Text>
        <Text style={[styles.overview, { color: theme.colors.text }]}>{movie.overview}</Text>
        {details && (
          <>
            <Text style={[styles.runtime, { color: theme.colors.text }]}>
              Runtime: {details.runtime} minutes
            </Text>
            <Text style={[styles.genres, { color: theme.colors.secondaryText }]}>
              Genres: {details.genres.map(g => g.name).join(', ')}
            </Text>
          </>
        )}
        
        {/* Rating Component */}
        <View style={[styles.ratingSection, { borderTopColor: theme.colors.border }]}>
          {user ? (
            <RatingInput movieId={movie.id} />
          ) : (
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login to Rate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color is now applied dynamically using theme
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    marginRight: 10,
  },
  votes: {
    color: '#666',
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  runtime: {
    fontSize: 16,
    marginBottom: 5,
  },
  genres: {
    fontSize: 16,
    color: '#666',
  },
  // Rating section styles
  ratingSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  loginButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
