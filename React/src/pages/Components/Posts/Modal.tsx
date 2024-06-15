import React, { useEffect, useRef, useState } from 'react';

interface UserData {
  id: number;
  name: string;
  profile_image?: string;
  role: string;
  service: string;
}

interface StoryData {
  id: number;
  user_id: number;
  media_path: string;
  media_type: 'image' | 'video';
  created_at?: string;
  user: UserData;
  isActive: boolean;
}

interface ModalProps {
  stories: StoryData[];
  story: StoryData;
  onClose: () => void;
  onLike: (storyId: number) => void;
  onSendReply: (storyId: number, message: string) => void;
}
function formatTimeAgo(dateString: string | number | Date | undefined) {
    if (!dateString) {
        return "Date inconnue";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Date invalide";
    }

    const now = new Date();
    const difference = now.getTime() - date.getTime();

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours} h ago`;
    } else if (days < 7) {
        return `${days} d ago`;
    } else if (weeks < 4) {
        return `${weeks} weeks ago`;
    } else if (months < 12) {
        return `${months} months ago`;
    } else {
        return `${years} year(s) ago`;
    }
}

const Modal: React.FC<ModalProps> = ({ stories,story, onClose, onLike, onSendReply }) => {
  const [reply, setReply] = useState('');
  const [liked, setLiked] = useState(false);  // State to track if the story is liked
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const submitReply = () => {
    onSendReply(story.id, reply);
    setReply('');
  };
  const handleLike = () => {
    setLiked(!liked);  // Toggle like state
    onLike(story.id);  // Call the onLike prop which might handle other effects
  };
  
  // Debugging createdAt
  console.log("createdAt:", story.created_at);
  const timeAgo = formatTimeAgo(story.created_at);
  console.log("Formatted time:", timeAgo);
  useEffect(() => {
    const advanceStory = () => {
      setCurrentStoryIndex((prevIndex) => 
        prevIndex + 1 >= stories.length ? 0 : prevIndex + 1
      );
    };

    timeoutRef.current = setTimeout(advanceStory, 30000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStoryIndex, stories.length]);

  const handleNext = () => {
    setCurrentStoryIndex((prevIndex) => 
      prevIndex + 1 >= stories.length ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentStoryIndex((prevIndex) => 
      prevIndex - 1 < 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  const story1 = stories[currentStoryIndex];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full m-4 dark:bg-slate-700 dark:border-zinc-500">
        <div className="flex justify-between items-start">
      
         
        </div>
        <div className="mt-4">
        <div className="flex items-center justify-between p-4">
    <div className="flex items-center space-x-4">
        <img
            src={story.user.profile_image ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(story.user.profile_image)}` : 'default_profile_image.png'}
            alt={story.user.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => { e.currentTarget.src = 'default_profile_image.png'; }} // Fallback for missing images
        />
            <div className="flex flex-col flex-grow">

        <h2 className="text-xl font-semibold">{story.user.name}</h2>
        <small className="text-sm text-slate-500">
                {formatTimeAgo(story.created_at)}
              </small>
    </div>    </div>

    <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
        &times; {/* Use this to represent the close operation visually */}
    </button>
</div>


          {story.media_type === 'video' ? (
            <video controls className="w-full max-h-96 rounded-lg object-cover">
              <source src={`http://localhost:8000/storage/${story.media_path}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={`http://localhost:8000/storage/${encodeURIComponent(story.media_path)}`} alt="Story" className="w-full max-h-96 rounded-lg object-cover"/>
          )}

        <div className="mt-4 flex space-x-2">
        <input
  type="text"
  value={reply}
  onChange={handleReplyChange}
  placeholder="Reply to story..."
  className="flex-1 border p-2 rounded-lg focus:border-blue-300 focus:outline-none dark:bg-slate-500"
/>
<button
  onClick={submitReply}
  className="ml-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-sm px-5 py-2.5"
>
  Send
</button>

        <button
      onClick={handleLike}
      className={`relative flex items-center justify-center w-10 h-10 text-center rounded-lg   overflow-hidden 
                 ${liked ? 'bg-red-500 text-white' : 'bg-white'} border-2 ${liked ? 'border-red-500' : 'border-red-500'}`}
    >
      {liked ? (
        // SVG for a filled heart (when liked)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" clipRule="evenodd" />
        </svg>
      ) : (
        // SVG for an outline heart (when not liked)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 stroke-red-500">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>

    </div>

    </div>
        </div>
      </div>
  );
};

export default Modal;
