import axios from 'axios';
import { Movie, MovieDetails, MovieResponse } from '../types/movie';

// Export these for use in other services
export const API_KEY = '65e5d5f63efe394bba67bbd98ae226b7'; // TMDB API key
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path: string): string => {
  return path ? `${IMAGE_BASE_URL}${path}` : '';
};

export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await api.get<MovieResponse>('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await api.get<MovieResponse>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  try {
    const response = await api.get<MovieDetails>(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Rate a movie (requires authentication)
export const rateMovie = async (movieId: number, rating: number, sessionId: string): Promise<boolean> => {
  try {
    // Rating must be between 0.5 and 10, in increments of 0.5
    const validRating = Math.max(0.5, Math.min(10, Math.round(rating * 2) / 2));
    
    const response = await api.post(`/movie/${movieId}/rating`, 
      { value: validRating },
      { params: { session_id: sessionId } }
    );
    
    return response.data.success || false;
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
};

// Delete a movie rating (requires authentication)
export const deleteMovieRating = async (movieId: number, sessionId: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/movie/${movieId}/rating`, {
      params: { session_id: sessionId }
    });
    
    return response.data.success || false;
  } catch (error) {
    console.error('Error deleting movie rating:', error);
    throw error;
  }
};

// Get account states for a movie (including the user's rating)
export const getMovieAccountStates = async (movieId: number, sessionId: string): Promise<any> => {
  try {
    const response = await api.get(`/movie/${movieId}/account_states`, {
      params: { session_id: sessionId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting movie account states:', error);
    throw error;
  }
};
