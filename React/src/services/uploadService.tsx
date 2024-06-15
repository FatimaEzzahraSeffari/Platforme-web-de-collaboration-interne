import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 

export const uploadVideo = async (files: File[], url: string | null, title: string, thumbnail: string) => {
  const token = localStorage.getItem('token'); 

  const formData = new FormData();

  // Append multiple files
  files.forEach(file => {
    formData.append('files[]', file);
  });

  if (url) {
    formData.append('url', url);
  }

  formData.append('title', title);
  formData.append('thumbnail', thumbnail);

  const response = await axios.post(`${API_URL}/videos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
};
export const fetchVideos = async () => {
    const token = localStorage.getItem('token'); // Assume token is stored in local storage
  
    const response = await axios.get(`${API_URL}/videos`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the request headers
      },
    });
  
    return response.data;
  };
  export const deleteVideo = async (videoId: string) => {
    const token = localStorage.getItem('token'); // Assume token is stored in local storage
  
    const response = await axios.delete(`${API_URL}/videos/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the request headers
      },
    });
  
    return response.data;
  };