// Theme interface
export interface Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    secondaryText: string;
    searchBar: string;
    searchBarText: string;
    rating: string;
    loading: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#0000ff',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#000000',
    border: '#dddddd',
    secondaryText: '#666666',
    searchBar: '#ffffff',
    searchBarText: '#000000',
    rating: '#666666',
    loading: '#0000ff',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#4d4dff',
    background: '#404040',  // Medium grey background - darker than before but lighter than cards
    card: '#1e1e1e',        // Keep the original dark card color
    text: '#ffffff',        // Keep white text for dark cards
    border: '#333333',      // Original dark border
    secondaryText: '#aaaaaa',
    searchBar: '#333333',   // Keep original dark searchbar
    searchBarText: '#ffffff',
    rating: '#aaaaaa',
    loading: '#4d4dff',
  },
};
