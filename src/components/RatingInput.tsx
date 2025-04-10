import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { rateMovie, deleteMovieRating, getMovieAccountStates } from '../services/movieService';
import { useTheme } from '../theme/ThemeContext';

interface RatingInputProps {
  movieId: number;
  onRatingSubmitted?: (rating: number) => void;
}

export const RatingInput: React.FC<RatingInputProps> = ({ movieId, onRatingSubmitted }) => {
  const { theme } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ratings from 1 to 10
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Fetch user's current rating for this movie
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !user.sessionId) return;

      setIsLoading(true);
      try {
        const accountStates = await getMovieAccountStates(movieId, user.sessionId);
        if (accountStates.rated) {
          setUserRating(accountStates.rated.value);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRating();
  }, [movieId, user]);

  const handleRateMovie = async (rating: number) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to rate movies');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await rateMovie(movieId, rating, user.sessionId);
      if (success) {
        setUserRating(rating);
        if (onRatingSubmitted) {
          onRatingSubmitted(rating);
        }
        Alert.alert('Success', 'Your rating has been submitted!');
      } else {
        Alert.alert('Error', 'Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error rating movie:', error);
      Alert.alert('Error', 'An error occurred while submitting your rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!user || userRating === null) return;

    setIsSubmitting(true);
    try {
      const success = await deleteMovieRating(movieId, user.sessionId);
      if (success) {
        setUserRating(null);
        if (onRatingSubmitted) {
          onRatingSubmitted(0);
        }
        Alert.alert('Success', 'Your rating has been removed');
      } else {
        Alert.alert('Error', 'Failed to remove rating. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      Alert.alert('Error', 'An error occurred while removing your rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loginPrompt, { color: theme.colors.secondaryText }]}>
          Login to rate this movie
        </Text>
      </View>
    );
  }

  if (isLoading || authLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {userRating ? 'Your Rating' : 'Rate This Movie'}
      </Text>
      
      <View style={styles.starsContainer}>
        {ratings.map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.starButton,
              { opacity: isSubmitting ? 0.5 : 1 }
            ]}
            onPress={() => handleRateMovie(rating)}
            disabled={isSubmitting}
          >
            <Text 
              style={[
                styles.star, 
                { 
                  color: userRating && rating <= userRating 
                    ? theme.colors.primary 
                    : theme.colors.secondaryText 
                }
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {userRating !== null && (
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: theme.colors.border }]}
          onPress={handleDeleteRating}
          disabled={isSubmitting}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.text }]}>
            Remove Rating
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 24,
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    fontSize: 14,
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
