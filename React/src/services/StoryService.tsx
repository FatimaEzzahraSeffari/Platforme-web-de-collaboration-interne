import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';
const api = axios.create({
  baseURL: API_URL,
});
// Interfaces for user and story data
interface UserData {
    id: number;
    name: string;
    profile_image?: string;
    role: string;
    service: string;
  }
  
 export interface StoryData {
    id: number;
    user_id: number;
    mediaPath: string;
    mediaType: 'image' | 'video';  // Specify allowed media types
    createdAt?: string;
    user: UserData;
    isActive: boolean;
    username: string;
    bgColor: string;
    image: string;
    
      // User data embedded within story data
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;  // Optional message from the API
  }
  
// Configuration des intercepteurs pour inclure le jeton JWT
api.interceptors.request.use(
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


 // Function to fetch stories for a specific user

export const fetchAllStories = async () => {
    try {
        const response = await axios.get(`${API_URL}stories`);
        return response.data; // assuming the response is directly the list of stories
    } catch (error) {
        console.error("Error fetching all stories:", error);
        return []; // Return an empty array in case of error to ensure type consistency
    }
};

  
  // Function to upload a new story
  export const uploadStory = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('media', file);

    const response = await axios.post(`${API_URL}stories/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data; // Ensure you are returning the data
};
  
  // Export the StoryService
  export const StoryService = {
    fetchAllStories ,
    uploadStory,
  };
  
  export default StoryService;
