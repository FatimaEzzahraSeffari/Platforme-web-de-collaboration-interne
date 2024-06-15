import axios from 'axios';
import { ApiResponse, PostData } from './PostService';
import { MediaPostData } from './MediaService';


// Base API URL
const API_URL = 'http://localhost:8000/api/';
interface ToggleFavoriteResponse {
    error: boolean;
    message: any;
    favorites_count: number;
    isFavorited: boolean;  // Assuming this property needs to be added

  }
// Setup Axios Interceptors for Authorization header
axios.interceptors.request.use(
  config => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Service for handling favorites
const toggleFavorite = async (postId: number): Promise<ToggleFavoriteResponse> => {
    const response = await axios.post<ToggleFavoriteResponse>(`${API_URL}favorites/toggle`, { post_id: postId });
    return response.data;  // Assuming the API returns an object directly with favorites_count
  };

// Optionally, you might want to fetch all favorites for a user
const fetchFavorites = async (): Promise<PostData[]> => {
    const response = await axios.get<PostData[]>(`${API_URL}favorites`);
    return response.data; // Directly return the response data if it's an array
  };
  //mediapost favourite
  const togglemediaFavorite = async (mediapostId: number): Promise<ToggleFavoriteResponse> => {
    const response = await axios.post<ToggleFavoriteResponse>(`${API_URL}favorites/mediatoggle`, { mediapost_id: mediapostId });
    return response.data;  // Assuming the API returns an object directly with favorites_count
  };

// Optionally, you might want to fetch all favorites for a user
const fetchmediaFavorites = async (): Promise<MediaPostData[]> => {
  try {
    const response = await axios.get<MediaPostData[]>(`${API_URL}mediafavorites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching media favorites:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};


  

export const FavoritesService = {
  toggleFavorite,
  fetchFavorites,
  fetchmediaFavorites,
  togglemediaFavorite,
};

export default FavoritesService;
