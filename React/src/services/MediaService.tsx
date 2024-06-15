import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Ajustez selon votre URL de l'API

// Définissez le type de données pour un post média

interface UserData {
    id: number;
    name: string;
    profile_image: string;
    role: string;
    service: string;
  }
interface PostData {
    id: number;
    content: string;
    user: UserData;
    created_at?: string; // Optional based on your usage
    isFavorited: boolean;
    favorites_count: number;
    shareCount: number;
  }
  export interface MediaPostData {
    type: 'post' | 'mediaPost';  // Assuming only two types for simplicity
    id: number;
    title: string;
    description: string;
    media_url: string;
    mention: string;
    user: UserData; // Direct user data for the media post
    created_at: string;
    post: PostData; // Nested PostData within MediaPostData
    isFavorited: boolean; // Add this line
    favorites_count: number;  // Add this line to include the favorites count
    shareCount:number;
    favorites_created_at?: string; // Add this property
  }
  
  
// Définissez le type pour la structure de réponse que votre API retourne
export interface ApiResponse<T> {
  success: MediaPostData;
  data: T;
  message?: string;
  // autres champs que votre réponse API pourrait avoir
}

// Setup Axios Interceptors pour inclure le token d'authentification
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

// Fonctions pour interagir avec les posts médias
export const fetchMediaPosts = async (): Promise<MediaPostData[]> => {
    const response = await axios.get<ApiResponse<MediaPostData[]>>(`${API_URL}media-posts`);
    if (response.data && response.data.data) {
      return response.data.data; // Ensuring that you are returning the correct structure
    }
    throw new Error('Failed to fetch posts');
  };
  

// Dans MediaService.tsx
export const createMediaPost = async (formData: FormData) => {
    const response = await axios.post<ApiResponse<MediaPostData>>(`${API_URL}media-posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };
  
  const deletemediaPost = async (mediapostId: number) : Promise<{ message: string }>=> {
    try{
    const response = await axios.delete<ApiResponse<{ message: string }>>(`${API_URL}media-posts/${mediapostId}`);
    return {
      message: response.data.message || "Default success message if none provided from backend."
    };
  } catch (error: any) {
    console.error('Error deleting comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to delete comment');
  }
  };
  //edit mediapost 



//   export const editmediaPost = async (mediapostId: number, formData: FormData) => {
//     // Append '_method' to the FormData to enable method spoofing
//     formData.append('_method', 'PUT');

//     try {
//         const response = await axios.post(`${API_URL}media-posts/${mediapostId}`, formData);
//         return response.data;
//     } catch (error: any) {
//         if (error.response) {
//             console.error('Server responded with non 2xx code:', error.response.data);
//         } else if (error.request) {
//             console.error('No response received:', error.request);
//         } else {
//             console.error('Error setting up the request:', error.message);
//         }
//         return null;  // Consider returning the error or a more informative message
//     }
// };
export const editmediaPost = async (mediapostId: number, formData: FormData) => {
  try {
      const response = await axios.post(`${API_URL}media-posts/${mediapostId}`, formData);
      return response.data;
  } catch (error:any) {
      console.error('Error updating media post:', error.response ? error.response.data : error.message);
      return null;
  }
};

export const MediaService = {
  fetchMediaPosts,
  createMediaPost,
  deletemediaPost,
  editmediaPost
};

export default MediaService;
