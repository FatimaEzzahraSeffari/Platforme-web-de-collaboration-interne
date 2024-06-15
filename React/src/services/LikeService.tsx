import axios from 'axios';

export type LikeDataResponse = {
    likeCount: number;
    initiallyLiked: boolean;
  };
  
  export type LikeResponse = {
    liked: boolean;
    likeCount: number; // Assuming the backend also sends the updated like count
  };

export class LikeService {
  private apiUrl = 'http://localhost:8000/api/';

  // Method to toggle the like status
  public async toggleLike(postId: number): Promise<LikeResponse> {
    const response = await axios.post<LikeResponse>(`${this.apiUrl}posts/${postId}/like`);
    return response.data;
  }

  // Method to fetch the initial like data
  public async getLikeData(postId: number): Promise<LikeDataResponse> {
    const response = await axios.get<LikeDataResponse>(`${this.apiUrl}posts/${postId}/likes`);

    return response.data;
  }

  //like media post 
  public async mediatoggleLike(mediapostId: number): Promise<LikeResponse> {
    const response = await axios.post<LikeResponse>(`${this.apiUrl}mediaposts/${mediapostId}/like`);
    return response.data;
  }

  // Method to fetch the initial like data
  public async mediagetLikeData(mediapostId: number): Promise<LikeDataResponse> {
    const response = await axios.get<LikeDataResponse>(`${this.apiUrl}mediaposts/${mediapostId}/likes`);

    return response.data;
  }

}
