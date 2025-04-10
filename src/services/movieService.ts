import axios from 'axios';
import { Movie, MovieDetails, MovieResponse } from '../types/movie';

const API_KEY = '65e5d5f63efe394bba67bbd98ae226b7'; // TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
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
