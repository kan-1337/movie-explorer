import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Movie } from '../types/movie';
import { MovieCard } from '../components/MovieCard';
import { getPopularMovies, searchMovies } from '../services/movieService';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const loadMovies = async (reset: boolean = false) => {
    try {
      const newPage = reset ? 1 : page;
      const response = searchQuery
        ? await searchMovies(searchQuery, newPage)
        : await getPopularMovies(newPage);
      
      setMovies(reset ? response.results : [...movies, ...response.results]);
      setPage(newPage + 1);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      loadMovies(true);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMovies(true);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: theme.colors.searchBar,
          borderColor: theme.colors.border,
          color: theme.colors.searchBarText
        }]}
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={theme.colors.secondaryText}
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={handleMoviePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => loadMovies()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color={theme.colors.loading} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color is now applied dynamically using theme
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    // Colors are now applied dynamically using theme
  },
});
