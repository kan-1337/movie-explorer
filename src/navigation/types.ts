import { Movie } from '../types/movie';

export type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movie: Movie };
};
