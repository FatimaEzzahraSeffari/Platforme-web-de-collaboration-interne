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
  likes_count: number;  // Add this line to include likes count in the Comment type
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


export const postReplyComment = async (replyCommentId: number, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`comments/${replyCommentId}/replies`, commentData);
    return response.data;
  } catch (error: any) {
    console.error('Error posting reply comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to post reply comment');
  }
};

// Assuming ApiResponse wraps the actual data
export const fetchReplyComments = async (replyCommentId: number) => {
  try {
    const response = await api.get<ApiResponse<Comment[]>>(`comments/${replyCommentId}/replies`);

      console.log('API response for comment ID ' + replyCommentId + ':', response);
      return response.data; // Correctly access nested data
  } catch (error: any) {
      console.error('Error fetching reply comments:', error.response?.data?.message || error.message);
      throw new Error('Failed to fetch comments');
    }
};




export const updateReplyComment = async (replyCommentId: number, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await axios.put(`http://localhost:8000/api/replycomments/${replyCommentId}`, commentData);
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





export const deleteReplyComment = async (replyCommentId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`replycomments/${replyCommentId}`);
    return {
        message: response.data.message || "Default success message if none provided from backend."
      };
  } catch (error: any) {
    console.error('Error deleting reply comment:', error.response?.data?.message || error.message);
    throw new Error('Failed to delete reply comment');
  }
};

export const likeReplyComment = async (replyCommentId: number): Promise<Comment> => {
  try {
    const response = await api.patch<Comment>(`replycomments/${replyCommentId}/like`);
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
  postReplyComment,
  fetchReplyComments,
  updateReplyComment,
  deleteReplyComment,
  likeReplyComment
};
