import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import StoryService from 'services/StoryService';
import Modal from './Modal';

interface UserData {
  id: number;
  name: string;
  profile_image?: string;
  role: string;
  service: string;
}

export interface StoryData {
  id: number;
  user_id: number;
    media_path: string;  // Modifier ici pour correspondre à la structure de données du backend
    media_type: 'image' | 'video';
  createdAt?: string;
  user: UserData;
  isActive: boolean;
  isViewed?: boolean;  // True if the story has been viewed

}

export interface Props {
  storyData: StoryData[];
  uploadStory: (file: File) => void;
  currentUserProfileImage: string | undefined;
  currentUserId: number;
}

const StoryDisplay: React.FC<Props> = ({ storyData, uploadStory, currentUserProfileImage }) => {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [groupedStories, setGroupedStories] = useState<{ [key: number]: StoryData[] }>({});
  const [currentUserId, setCurrentUserId] = useState<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        try {
            const response = await StoryService.uploadStory(file);
            console.log("Upload success:", response); // This line should log the response correctly
            if (response && response.message) {
                // Handle success
            } else {
                // Handle missing data
                console.error("Upload failed, no data returned.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
};

useEffect(() => {
  const userJson = localStorage.getItem('user');
  const userData = userJson ? JSON.parse(userJson) : null;
  if (userData && userData.user && typeof userData.user.id === 'number') {
    setCurrentUserId(userData.user.id);
  }
}, []);


useEffect(() => {
  if (currentUserId != null) {  // Ensure currentUserId is set
    const loadStories = async () => {
      const allStories = await StoryService.fetchAllStories();
      const convertedStories = allStories.map((story: { id: any; }) => {
        const storageKey = `story_viewed_${currentUserId}_${story.id}`;
        const isViewed = localStorage.getItem(storageKey) === 'true';
        return {
          ...story,
          isViewed: isViewed,
        };
      });
      setStories(convertedStories);
    };

    loadStories();
  }
}, [currentUserId]); // Dependency ensures this runs when currentUserId changes


  useEffect(() => {
    const groups: { [key: number]: StoryData[] } = {};
    stories.forEach(story => {
      if (groups[story.user_id]) {
        groups[story.user_id].push(story);
      } else {
        groups[story.user_id] = [story];
      }
    });

    // Assurez-vous qu'un groupe existe pour le currentUser
    if (currentUserId !== undefined && !groups[currentUserId]) {
      groups[currentUserId] = []; 
    }

    setGroupedStories(groups);
  }, [stories, currentUserId]);

  
  const handlePlusClick = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    console.log('Plus icon clicked, attempting to open file input...');
    event.stopPropagation(); // Stops the click event from bubbling up to the Link
    fileInputRef.current?.click();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);

  const handleStoryClick = (story: StoryData) => {
    if (!story) return; // Guard clause to handle null or undefined, just in case

    // Proceed knowing `story` is definitely not null
    const storageKey = `story_viewed_${currentUserId}_${story.id}`;
    localStorage.setItem(storageKey, 'true');

    const updatedStories = stories.map(s => {
        if (s.id === story.id) {
            return { ...s, isViewed: true };
        }
        return s;
    });

    setStories(updatedStories);
    setSelectedStory(story);
    setModalOpen(true);
};



  return (
    <React.Fragment>
    <SimpleBar className="w-full">
  <div className="flex gap-2">
    {/* Rendre d'abord le cercle du currentUser, s'il est défini */}
    {/* Rendre d'abord le cercle du currentUser, s'il est défini */}
    {currentUserId !== undefined && groupedStories[currentUserId] && (
  <div className="story-circle" key={currentUserId} onClick={() => handleStoryClick(groupedStories[currentUserId][0])}>
  <div className={`relative mx-auto w-16 h-16  rounded-full border-2  border-slate-200 bg-white `}>
    {/* <Link to={groupedStories[currentUserId].length > 0 ? `/story/${groupedStories[currentUserId][0].id}` : '/'} className="block w-full h-full"> */}
      <img src={currentUserProfileImage || 'default_profile_image.png'}
        alt={groupedStories[currentUserId].length > 0 ? groupedStories[currentUserId][0].user.name : 'Your Story'}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => { e.currentTarget.src = 'default_profile_image.png'; }}
      />
    {/* </Link> */}
    <label htmlFor={`story-upload-${currentUserId}`} className="absolute inset-auto bottom-0 right-0 mb-1 mr-1 flex justify-center items-center cursor-pointer" onClick={(e) => {
        e.stopPropagation();  // Prevents the event from bubbling up to the Link
        handlePlusClick(e);  // Handles the upload action
      }}>
     <div className="absolute flex items-center justify-center size-5 text-white rounded-full ltr:-right-2.5 rtl:-left-0.5 -bottom-0.5 bg-sky-500">
          <Plus className="size-4" />
        </div>
    </label>
    <input type="file" id={`story-upload-${currentUserId}`} className="hidden" accept="image/*,video/*" onChange={handleFileInput} />
  </div>
  <h6 className="mt-2 text-sm font-normal truncate text-center">Your Story</h6>
</div>

)}


    {/* Ensuite, rendre les cercles des autres utilisateurs */}
    {Object.entries(groupedStories).filter(([userId, _]) => parseInt(userId) !== currentUserId).map(([userId, userStories]) => (
  <div className="story-circle" key={userId} onClick={() => handleStoryClick(userStories[0])}>
    <div className={`relative mx-auto w-16 h-16 rounded-full border-2 ${userStories[0].isViewed ? 'border-gray-300' : 'border-blue-500'} hover:border-blue-700 transition-colors duration-300 bg-white `}>
      <img 
        src={userStories.length > 0 && userStories[0].user.profile_image ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(userStories[0].user.profile_image)}` : 'default_profile_image.png'}
        alt={userStories.length > 0 ? userStories[0].user.name : 'Add Story'}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => { e.currentTarget.src = 'default_profile_image.png'; }}
      />
    </div>
    <h6 className="mt-2 text-sm font-normal truncate text-center">{userStories.length > 0 ? userStories[0].user.name : 'Add Story'}</h6>
  </div>
))}

  </div>
</SimpleBar>
{modalOpen && selectedStory && (
        <Modal
          story={selectedStory}
          onClose={() => setModalOpen(false)}
          onLike={(id) => console.log('Like story', id)} // Implement this function as needed
          onSendReply={(id, message) => console.log('Send reply', id, message)} // Implement this function as needed
          stories={[]}                  />
      )}
  </React.Fragment>
  );
};

export default StoryDisplay;
