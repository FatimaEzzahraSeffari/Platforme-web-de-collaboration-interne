import axios from 'axios';
import { MediaPostData } from './MediaService';

const API_URL = 'http://localhost:8000/api/'; // Adjust according to your API URL
// Define the Post data type if necessary
const api = axios.create({
  baseURL: API_URL,
  
});
export interface UserData {
    id: number;
    name: string;
    service:string;
    role:string;
    avatar: string; // Si l'avatar est toujours présent
    profile_image?: string;
  }
  export interface CommentData {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
    created_at?: string;
  }
  export interface PostData {
    data: any;
    shareCount: number;
    id: number;
    content: string;
    user: UserData;
    created_at?: string;
    isFavorited: boolean; // Add this line
    favorites_count: number;  // Add this line to include the favorites count
    favorites_created_at?: string; // Add this property
    type: 'post' | 'mediaPost';  // Assuming only two types for simplicity

  }
  
  // Define the type for the response structure that your API returns, if needed
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    // other fields that your API response might have
  }
  export interface CreatePostData {
    content: string;
  }
  // Setup Axios Interceptors
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
const getPosts = async () => {
  const response = await axios.get<ApiResponse<PostData[]>>(`${API_URL}posts`);
  return response.data;
};

const createPost = async (postData: CreatePostData) => {
    const response = await axios.post<ApiResponse<PostData>>(`${API_URL}posts`, postData);
    return response.data;
  };
  const getCommentsCount = async (postId: number) => {
    const response = await axios.get(`${API_URL}posts/${postId}/comments/count`);
    return response.data.commentsCount;
};

const updatePost = async (postId: number, postData: PostData) => {
  const response = await axios.put<ApiResponse<PostData>>(`${API_URL}posts/${postId}`, postData);
  return response.data;
};

const deletePost = async (postId: number) : Promise<{ message: string }>=> {
  try{
  const response = await axios.delete<ApiResponse<{ message: string }>>(`${API_URL}posts/${postId}`);
  return {
    message: response.data.message || "Default success message if none provided from backend."
  };
} catch (error: any) {
  console.error('Error deleting post:', error.response?.data?.message || error.message);
  throw new Error('Failed to delete post');
}    

};

//edit post
export const editPost = async (postId: number, postData: PostData): Promise<PostData> => {
  try {
    const response = await axios.put(`http://localhost:8000/api/posts/${postId}`, postData);
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

export const fetchAllPosts = async (): Promise<(PostData | MediaPostData)[]> => {
  try {
    const [postResponse, mediaPostResponse] = await Promise.all([
      axios.get(`${API_URL}posts`),
      axios.get(`${API_URL}media-posts`)
    ]);
    const posts = postResponse.data.data as PostData[];
    const mediaPosts = mediaPostResponse.data.data as MediaPostData[];
    const combinedPosts = [...posts, ...mediaPosts];
    combinedPosts.sort((a, b) => {
      // Provide a fallback for undefined created_at dates, here using the Unix Epoch (0)
      const dateA = new Date(a.created_at ?? 0).getTime();
      const dateB = new Date(b.created_at ?? 0).getTime();
      return dateB - dateA;
    });
    return combinedPosts; // Ensure this line is actually executed
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Ensure that errors are properly propagated
  }
};
//reply


// totalposts 
export const getTotalPostsByUser = async (userId: number) => {
  try {
    const [postResponse, mediaPostResponse] = await Promise.all([
      axios.get(`${API_URL}posts/count`, { params: { user_id: userId } }),
      axios.get(`${API_URL}media-posts/count`, { params: { user_id: userId } })
    ]);
    const postCount = postResponse.data.count;
    const mediaPostCount = mediaPostResponse.data.count;
    const totalPosts = postCount + mediaPostCount;
    return totalPosts;
  } catch (error) {
    console.error('Error fetching total posts by user:', error);
    throw error;
  }
};

export const PostService = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getCommentsCount,
    fetchAllPosts,
    editPost,
    getTotalPostsByUser
    
  };
  

export default PostService;
