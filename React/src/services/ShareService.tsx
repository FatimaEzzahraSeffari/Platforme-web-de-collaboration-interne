import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const sharePost = async (postId: number) => {
  const response = await axios.post(`${API_URL}posts/${postId}/share`);
  return response.data;
};
export const shareMediaPost = async (mediapostId: number) => {
  const response = await axios.post(`${API_URL}mediaposts/${mediapostId}/share`);
  return response.data;
};


