import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MovieDetails } from '../types/movie';
import { getMovieDetails, getImageUrl } from '../services/movieService';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

export const MovieDetailsScreen: React.FC<Props> = ({ route }) => {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.backdrop}
        source={{
          uri: getImageUrl(movie.backdrop_path || movie.poster_path),
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.votes}>({movie.vote_count} votes)</Text>
        </View>
        <Text style={styles.releaseDate}>
          Release Date: {movie.release_date}
        </Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        {details && (
          <>
            <Text style={styles.runtime}>
              Runtime: {details.runtime} minutes
            </Text>
            <Text style={styles.genres}>
              Genres: {details.genres.map(g => g.name).join(', ')}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
