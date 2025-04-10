import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieService';
import { useTheme } from '../theme/ThemeContext';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <Image
        style={styles.image}
        source={{ uri: getImageUrl(movie.poster_path) }}
      />
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: theme.colors.rating }]}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={[styles.votes, { color: theme.colors.secondaryText }]}>({movie.vote_count})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginRight: 5,
  },
  votes: {
    fontSize: 12,
  },
});
