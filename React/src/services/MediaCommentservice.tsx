import axios from 'axios';

interface CommentData {
    content: string;
}

export interface User {
  id: number;
  name: string;
  profile_image?: string;
}

export interface Comment {
  id: number;
  content: string;
  mediapost_id: number;
  user_id: number;
  user: User;
  created_at?: string;
  likes_count: number;  // Add this line to include likes count in the Comment type

}

interface ApiResponse<T> {
  data: T;
  message?: string;
}
interface CountResponse {
  count: number;
}

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  
});

// Setup Axios Interceptors for Authentication Token
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

export const postComment = async (mediapostId: number, commentData: CommentData) => {
  try {
    const response = await api.post<ApiResponse<Comment>>(`mediaposts/${mediapostId}/comments`, commentData);
    return response.data;
  } catch (error: any) {
    console.error('Error posting comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to post comment');
  }
};

export const fetchComments = async (mediapostId: number) => {
  try {
    const response = await api.get<ApiResponse<Comment[]>>(`mediaposts/${mediapostId}/comments`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching comments:', error.response?.data?.message || error.message);
    throw new Error('Failed to fetch comments');
  }
};
export const getCommentsCount = async () => {
  try {
    // Notice we're using CountResponse now, not Comment[]
    const response = await api.get<ApiResponse<CountResponse>>(`comments/count`);

    console.log('Comment Count Response:', response.data); // This should now work
    return response.data.data; // Assuming your API wraps the response in a 'data' property
  } catch (error) {
    console.error('Error fetching comments count:', error);
    throw error;
  }
};

export const getCommentsCountForPost = async (mediapostId: number): Promise<number> => {
  try {
    const response = await api.get<CountResponse>(`/mediaposts/${mediapostId}/comments/count`);
    if (response.data && typeof response.data.count === 'number') {
      return response.data.count;
    } else {
      console.error('Structure de réponse invalide :', response.data);
      return 0; // Retourner une valeur par défaut en cas de structure de réponse invalide
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de commentaires pour le post :', error);
    throw error;
  }
};

export const likeComment = async (mediacommentId: number): Promise<Comment> => {
  try {
    const response = await api.patch<Comment>(`mediacomments/${mediacommentId}/like`);
    if (!response.data) {
      console.error('No data returned from like comment API');
      throw new Error('No data returned from API');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error liking comment:', error.response?.data?.message || error.message, 'Full error:', error);
    throw new Error('Failed to like comment');
  }
};
export const deleteComment = async (mediacommentId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`mediacomments/${mediacommentId}`);
    return {
      message: response.data.message || "Default success message if none provided from backend."
    };
  } catch (error: any) {
    console.error('Error deleting comment:', error.response?.data?.message || error.message);
    // Handle different types of errors based on status code
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Unauthorized to delete this comment');
      } else if (error.response.status === 404) {
        throw new Error('Comment not found');
      } else {
        throw new Error('Failed to delete comment');
      }
    } else {
      throw new Error('Network error');
    }
  }
};
// Edit a specific comment

export const editComment = async (mediacommentId: number, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await axios.put(`http://localhost:8000/api/mediacomments/${mediacommentId}`, commentData);
    if (!response.data) {
      throw new Error('No data returned from API');
    }
    // Directly return response.data since that's how your backend is structured
    return response.data;  
  }catch (error: any) {
      console.error('Error updating comment:', error.response?.data?.message || error.message);
    throw error;  // To handle this error upstream in your components
  }
};
export const CommentService = {
  postComment,
  fetchComments,
  getCommentsCount,
  getCommentsCountForPost,
  likeComment,
  deleteComment,
  editComment
};
