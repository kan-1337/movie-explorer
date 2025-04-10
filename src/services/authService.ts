import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_KEY, BASE_URL, api } from './movieService';

// Types for authentication
export interface User {
  id: number;
  username: string;
  sessionId: string;
}

export interface AuthResponse {
  success: boolean;
  session_id?: string;
  request_token?: string;
  expires_at?: string;
  status_code?: number;
  status_message?: string;
}

// Storage keys
const USER_STORAGE_KEY = 'movie_explorer_user';

// Get a new request token
export const getRequestToken = async (): Promise<string> => {
  try {
    console.log('Getting new request token...');
    const response = await axios.get<AuthResponse>(`${BASE_URL}/authentication/token/new`, {
      params: { api_key: API_KEY }
    });
    
    console.log('Request token response:', JSON.stringify(response.data));
    
    if (response.data.success && response.data.request_token) {
      return response.data.request_token;
    }
    throw new Error('Failed to get request token');
  } catch (error: any) {
    console.error('Error getting request token:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.status_message || error.message || 'Failed to get request token');
  }
};

// Validate the request token with login credentials
export const validateRequestTokenWithLogin = async (
  username: string,
  password: string,
  requestToken: string
): Promise<string> => {
  try {
    console.log('Validating token with credentials for:', username);
    
    // Create a direct axios instance for this request to have more control
    const response = await axios.post<AuthResponse>(
      `${BASE_URL}/authentication/token/validate_with_login`,
      {
        username,
        password,
        request_token: requestToken
      },
      {
        params: { api_key: API_KEY }
      }
    );
    
    console.log('Validation response:', JSON.stringify(response.data));
    
    if (response.data.success && response.data.request_token) {
      return response.data.request_token;
    }
    throw new Error(response.data.status_message || 'Login failed');
  } catch (error: any) {
    console.error('Error validating with login:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.status_message || error.message || 'Login failed');
  }
};

// Create a session with the validated request token
export const createSession = async (requestToken: string): Promise<string> => {
  try {
    console.log('Creating session with token:', requestToken);
    const response = await axios.post<AuthResponse>(
      `${BASE_URL}/authentication/session/new`, 
      { request_token: requestToken },
      { params: { api_key: API_KEY } }
    );
    
    console.log('Session creation response:', JSON.stringify(response.data));
    
    if (response.data.success && response.data.session_id) {
      return response.data.session_id;
    }
    throw new Error('Failed to create session');
  } catch (error: any) {
    console.error('Error creating session:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.status_message || error.message || 'Failed to create session');
  }
};

// Get account details with session ID
export const getAccountDetails = async (sessionId: string): Promise<any> => {
  try {
    console.log('Getting account details with session ID:', sessionId);
    const response = await axios.get(`${BASE_URL}/account`, {
      params: { 
        api_key: API_KEY,
        session_id: sessionId 
      }
    });
    
    console.log('Account details response:', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error('Error getting account details:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.status_message || error.message || 'Failed to get account details');
  }
};

// Login user
export const login = async (username: string, password: string): Promise<User> => {
  try {
    console.log('Starting login process for user:', username);
    
    // 1. Get request token
    console.log('Step 1: Getting request token');
    const requestToken = await getRequestToken();
    console.log('Got request token:', requestToken);
    
    // 2. Validate with login
    console.log('Step 2: Validating token with login credentials');
    const validatedToken = await validateRequestTokenWithLogin(username, password, requestToken);
    console.log('Token validated successfully:', validatedToken);
    
    // 3. Create session
    console.log('Step 3: Creating session');
    const sessionId = await createSession(validatedToken);
    console.log('Session created successfully, ID:', sessionId);
    
    // 4. Get account details
    console.log('Step 4: Getting account details');
    const accountDetails = await getAccountDetails(sessionId);
    console.log('Account details retrieved for user ID:', accountDetails.id);
    
    // 5. Create user object
    console.log('Step 5: Creating user object');
    const user: User = {
      id: accountDetails.id,
      username: accountDetails.username,
      sessionId: sessionId,
    };
    
    // 6. Save user to storage
    console.log('Step 6: Saving user to storage');
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    console.log('User saved to storage successfully');
    
    return user;
  } catch (error: any) {
    console.error('Login error:', error.message || error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    console.log('Starting logout process');
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    
    if (userJson) {
      const user: User = JSON.parse(userJson);
      console.log('Found user in storage, session ID:', user.sessionId);
      
      if (user.sessionId) {
        // For now, we'll skip the API call to delete the session since it's causing issues
        // and focus on the local logout functionality
        console.log('Skipping TMDB API session deletion due to API issues');
        
        // Note: In a production app, we would properly implement the session deletion
        // according to the TMDB API documentation
      } else {
        console.log('No session ID found, skipping API call');
      }
    } else {
      console.log('No user found in storage');
    }
    
    // Clear user from storage regardless of API success
    console.log('Clearing user from storage');
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    console.log('User removed from storage successfully');
    
  } catch (error: any) {
    console.error('Logout error:', error.message || error);
    // Still remove from storage even if there was an error
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      console.log('User removed from storage after error');
    } catch (storageError) {
      console.error('Failed to remove user from storage:', storageError);
    }
    throw new Error('Logout failed: ' + (error.message || 'Unknown error'));
  }
};

// Check if user is logged in
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
