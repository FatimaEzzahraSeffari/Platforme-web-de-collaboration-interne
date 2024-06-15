import axios from 'axios';

export interface CommentData {
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
  post_id: number;
  user_id: number;
  user: User;
  created_at?: string;
  likes_count: number;  
  comment_id: number;
  mediacomment_id: number | null;
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
// In your Axios interceptor
api.interceptors.request.use(
  config => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log('Authorization Header:', config.headers.Authorization); // Add this line to log the token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


export const mediapostReplyComment = async (mediareplyCommentId: number, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`mediacomments/${mediareplyCommentId}/mediareplies`, commentData);
    return response.data;
  } catch (error: any) {
    console.error('Error posting reply comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to post reply comment');
  }
};


// Assuming ApiResponse wraps the actual data
export const mediafetchReplyComments = async (mediareplyCommentId: number) => {
  try {
    const response = await api.get<ApiResponse<Comment[]>>(`mediacomments/${mediareplyCommentId}/mediareplies`);

      console.log('API response for comment ID ' + mediareplyCommentId + ':', response);
      return response.data; // Correctly access nested data
  } catch (error: any) {
      console.error('Error fetching reply comments:', error.response?.data?.message || error.message);
      throw new Error('Failed to fetch comments');
    }
};
export const mediaupdateReplyComment = async (mediareplyCommentId: number, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await axios.put(`http://localhost:8000/api/mediacomments/${mediareplyCommentId}`, commentData);
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





export const mediadeleteReplyComment = async (mediareplyCommentId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`mediacomments/${mediareplyCommentId}`);
    return {
        message: response.data.message || "Default success message if none provided from backend."
      };
  } catch (error: any) {
    console.error('Error deleting reply comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to delete reply comment');
  }
};

export const medialikeReplyComment = async (mediareplyCommentId: number): Promise<Comment> => {
  try {
    const response = await api.patch<Comment>(`mediacomments/${mediareplyCommentId}/like`);
    if (!response.data) {
      console.error('No data returned from like comment API');
      throw new Error('No data returned from API');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error liking reply comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to like reply comment');
  }
};

export const ReplyService = {
  mediapostReplyComment,
  mediaupdateReplyComment,
  mediadeleteReplyComment,
  medialikeReplyComment
};
