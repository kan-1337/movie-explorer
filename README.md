# Movie Explorer

A React Native mobile application built with Expo and TypeScript that allows users to browse popular movies, search for specific titles, and view detailed information about each movie.

## Features

- Browse popular movies with infinite scrolling
- Search for movies by title
- View detailed movie information including ratings, release date, and overview
- Pull-to-refresh functionality
- Clean TypeScript implementation

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- The Movie Database (TMDB) API

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/YOUR_USERNAME/movie-explorer.git
   cd movie-explorer
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npx expo start
   ```

4. Open the app:
   - Scan the QR code with Expo Go (Android) or the Camera app (iOS)
   - Press 'w' to open in web browser
   - Press 'a' to open in Android emulator
   - Press 'i' to open in iOS simulator

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # API services
└── types/          # TypeScript interfaces
```

## API Reference

This project uses the TMDB API. You'll need to get an API key from [TMDB](https://www.themoviedb.org/settings/api) and replace it in `src/services/movieService.ts`.

## License

MIT
