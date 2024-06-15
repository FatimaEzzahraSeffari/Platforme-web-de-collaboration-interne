// LikemediaComponent.tsx

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { LikeService, LikeDataResponse } from '../../../services/LikeService';

type Props = {
  mediapostId: number;
};

const LikeMedia: React.FC<Props> = ({ mediapostId }) => {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const likeService = new LikeService();
//pour post 
  useEffect(() => {
    fetchLikes();
  }, [mediapostId]);

  const fetchLikes = async () => {
    try {
      const likeData: LikeDataResponse = await likeService.mediagetLikeData(mediapostId);
      setLikeCount(likeData.likeCount);
      setIsLiked(likeData.initiallyLiked);
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await likeService.mediatoggleLike(mediapostId); // No need for userId if using authentication
      setLikeCount(response.likeCount); // Use the count from the response
      setIsLiked(response.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <li>
      <button
        className="text-slate-500 dark:text-zink-200"
        onClick={handleLike}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <Heart className={`inline-block size-4 ltr:mr-1 rtl:ml-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
        <span className="align-middle">{`${likeCount} Like${likeCount !== 1 ? 's' : ''}`}</span>
      </button>
    </li>
  );
};

export default LikeMedia;
