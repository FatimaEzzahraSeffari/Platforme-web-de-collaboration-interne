import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";
import PostService, { PostData } from '../../../services/PostService'; 

import { CalendarDays, Plus, Video, Image, AtSign, GitPullRequest, MessagesSquare, HelpCircle, UserRoundX, MoreHorizontal, Heart, Send, Bookmark, CheckCircle, UploadCloud, DownloadCloudIcon, EditIcon, DeleteIcon, TrashIcon } from 'lucide-react';

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Images
import avatar1 from "assets/images/users/avatar-1.png";
import avatar5 from "assets/images/users/avatar-5.png";
import avatar7 from "assets/images/users/avatar-7.png";
import avatar8 from "assets/images/users/avatar-8.png";

import smallImg3 from "assets/images/small/img-3.jpg";
import smallImg5 from "assets/images/small/img-5.jpg";
import smallImg6 from "assets/images/small/img-6.jpg";

// import { storyData } from "Common/data";
import { Dropdown } from "Common/Components/Dropdown";
import Modal from "Common/Components/Modal";
import Dropzone from "react-dropzone";
import Post from "pages/Components/Posts/Post";
import Comment from "pages/Components/Posts/Comment";
import Commentdisplay from "pages/Components/Posts/Commentdisplay";
import MediaCommentdisplay from "pages/Components/Posts/MediaCommentDisplay";
import { formatDistanceToNow } from 'date-fns';
import { CommentService, getCommentsCount, getCommentsCountForPost } from "services/CommentService";
import CommentCount from "pages/Components/Posts/CommentCount";
import LikeComponent from "pages/Components/Posts/LikeComponent";
import FavoritesService from "services/FavoritesService";
import { sharePost } from "services/ShareService";
import whatssap from "assets/images/Whatssap.png";
import messenger from "assets/images/messanger.png";
import facebook from "assets/images/facebook.png";
import instagram from "assets/images/instagram.png";
import twitter from "assets/images/twitter.png";
import linkedin from "assets/images/linkedin.png";
import telegram from "assets/images/telegram.png";
import email from "assets/images/gmail.png";
import OCPLINK from "assets/images/OCPLINK.png";
import MediaService, { MediaPostData,fetchMediaPosts } from "services/MediaService";
import axios from "axios";
import MediaCommentCount from "pages/Components/Posts/MediaCommentCount";
import MediaComment from "pages/Components/Posts/MediaComment";
import LikeMedia from "pages/Components/Posts/likemedia";
import {ToastContainer, toast} from 'react-toastify';
import StoryDisplay,{StoryData} from "pages/Components/Posts/StoryUploader";
import StoryService from "services/StoryService";
import ConfirmationDialog from "pages/Components/Posts/Delete";
import EditCommentForm from "pages/Components/Posts/EditComment";
import ModalEdit from "pages/Components/Posts/Editmedia";
import EditPostModal from "pages/Components/Posts/EditPost";
import DeleteModal from "Common/DeleteModal";

interface Comment {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      profile_image: string;
    };
    created_at: string;
  }
interface CommentFeedProps {
    postId: number;
    mediapostId:number;
  }
  export interface CreateCommentData {
    content: string;
    post_id: number;
}
export interface CreateMediaCommentData {
  content: string;
  mediapost_id: number;
}
function formatTimeAgo(postCreatedAt: string | number | Date | undefined) {
    if (postCreatedAt) { // Assurez-vous que created_at n'est pas undefined
      const date = new Date(postCreatedAt);
      const now = new Date();
      const difference = now.getTime() - date.getTime();
  
      const minutes = Math.floor(difference / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
  
      if (minutes < 60) {
        return `${minutes} min`;
      } else if (hours < 24) {
        return `${hours} h`;
      } else if (days < 7) {
        return `${days} j`;
      } else if (weeks < 4) {
        return `${weeks} semaines`;
      } else if (months < 12) {
        return `${months} mois`;
      } else {
        return `${years} an(s)`;
      }
    } else {
      return "Date inconnue"; // Gérer le cas où la date n'est pas définie
    }
  }
  type PostOrMediaPost = PostData | MediaPostData;

 
  const CommentFeed: React.FC<CommentFeedProps> = ({ postId,mediapostId }) => {
    const [index, setIndex] = useState<any>(-1);
    const [isDialogOpenpost, setDialogOpenpost] = useState<boolean>(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const productGallery = [smallImg6, smallImg3, smallImg5];

    const slideGallery = productGallery.map((item: any) => ({ "src": item }));

    // Story LightBox
    const [storyBox, setStoryBox] = useState<boolean>(false);

    // Add/Edit Modal
    const [defaultModal, setDefaultModal] = useState<boolean>(false);
    const defaultToggle = () => setDefaultModal(!defaultModal);

    const [defaultEventModal, setDefaultEventModal] = useState<boolean>(false);
    const defaultEventToggle = () => setDefaultEventModal(!defaultEventModal);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [mediaposts, setMediaPosts] = useState<MediaPostData[]>([]);
    

    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const userId = currentUser?.user?.id;

    // Construct the profile image URL using the profile_image from currentUser.user
    const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
      ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
      : undefined;
  // Replace with your actual default image path

  // postIdArray is the dependency, not postId
  
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await PostService.getPosts();
          setPosts(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchPosts();
      const intervalId = setInterval(fetchPosts, 15000); // Refresh every 60 seconds
  
      return () => clearInterval(intervalId);
    }, []);
    
    
    useEffect(() => {
      const fetchAndUpdate = () => {
        fetchMediaPosts().then(setMediaPosts).catch(console.error);
      };
    
      fetchAndUpdate(); // Initial fetch
      const intervalId = setInterval(fetchAndUpdate, 5000); // Refresh every 5 seconds
    
      return () => clearInterval(intervalId);
    }, []) // Make sure all external dependencies used inside are stable
    

    const handleToggleFavorite = async (postId: number) => {
      try {
          const response = await FavoritesService.toggleFavorite(postId);
          const { isFavorited, favorites_count } = response; // Récupérer le nombre de favoris de la réponse
  
          setPosts(prevPosts => prevPosts.map(post => {
              if (post.id === postId) {
                  return { ...post, isFavorited, favorites_count };
              }
              return post;
          }));
  
          if (isFavorited) {
              toast.success("Added to favorites!");
          } else {
              toast.info("Removed from favorites!");
          }
      } catch (error) {
          console.error('Failed to toggle favorite:', error);
          toast.error("Failed to toggle media favorite");
      }
  };
  const handleTogglemediaFavorite = async (mediapostId:number) => {
    try {
      const response = await FavoritesService.togglemediaFavorite(mediapostId);
      const { isFavorited, favorites_count } = response;

        setMediaPosts(prevMediaPosts => prevMediaPosts.map(mediapost => {
            if (mediapost.id === mediapostId) {
                return { ...mediapost, isFavorited, favorites_count };
            }
            return mediapost;
        }));

        if (isFavorited) {
            toast.success("Media added to favorites!");
        } else {
            toast.info("Media removed from favorites!");
        }
    } catch (error) {
        console.error('Failed to toggle media favorite:', error);
        toast.error("Failed to toggle media favorite");
    }
};



   

    const btnFollow = (ele: any) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    // Dropzone
    const [selectfiles, setSelectfiles] = useState([]);

    const handleAcceptfiles = (files: any) => {
        files?.map((file: any) => {
            return Object.assign(file, {
                priview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            });
        });
        setSelectfiles(files);
    };

    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    
   
      
      // New state for active dropdown
      const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
      const [activeMediaPostDropdown, setActiveMediaPostDropdown] = useState<number | null>(null);

      // Other state initializations and useEffect hooks remain the same
    
      const handleShare = (postId: number) => {
        // Toggle the active dropdown based on whether it's already active
        setActiveDropdown(activeDropdown === postId ? null : postId);
      };
      const shareMediaPost = (mediapostId: number) => {
        // Toggle the active dropdown based on whether it's already active
        setActiveMediaPostDropdown(activeMediaPostDropdown === mediapostId ? null : mediapostId);
      };

  const [isActive, setIsActive] = useState<boolean>(false);
  const handleMediaPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Pour éviter le rechargement de la page
    const formData = new FormData();
    formData.append('title', (document.getElementById('postTitle') as HTMLInputElement).value);
    formData.append('description', (document.getElementById('descriptionInput') as HTMLInputElement).value);
    formData.append('mention', (document.getElementById('mentionUserSelect') as HTMLInputElement).value);

    selectfiles.forEach(file => {
        formData.append('media', file);
    });
    try {
      const response = await MediaService.createMediaPost(formData);
        // Ajouter le nouveau media post à l'état
        console.log('Media post created:', response);
        toast.success("Media post added successfully!"); // Affiche un message de succès
        defaultToggle(); // Cette fonction suppose fermer le modal
        resetForm(); // Réinitialise le formulaire
      } catch (error) {
      console.error('Error creating media post:', error);
      toast.error("Failed to create media post."); // Show error toast notification
  }
}
const resetForm = () => {
  (document.getElementById('postTitle') as HTMLInputElement).value = '';
  (document.getElementById('descriptionInput') as HTMLInputElement).value = '';
  (document.getElementById('mentionUserSelect') as HTMLInputElement).value = '';
  // Si vous avez un état pour les fichiers sélectionnés, vous devriez le réinitialiser ici aussi
  setSelectfiles([]);
};


  const combinedPosts = [...posts, ...mediaposts];
  const sortedPosts = combinedPosts.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
  const [storyData, setStoryData] = useState<StoryData[]>([]); 
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [showMediaPostModal, setShowMediaPostModal] = useState(false);

  useEffect(() => {
    // Supposons que vous récupériez les données de l'utilisateur actuel et les stories ici
    const fetchUserData = async () => {
      const userId = 1; // Exemple d'ID utilisateur
      const stories = await StoryService.fetchAllStories();

      setCurrentUserId(userId);
      setStoryData(stories);
    };

    fetchUserData();
  }, []);// Assurez-vous de charger ou initialiser cela quelque part
  const uploadStory = async (file: File) => {
    // Implémentez l'upload du fichier ici
    console.log(file);
    // Supposez que vous appeliez une API pour uploader le fichier
  };

  const [showComments, setShowComments] = useState(false);
  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };
  const [showmediaComments, setShowmediaComments] = useState(false);
  const togglemediaCommentsVisibility = () => {
    setShowmediaComments(!showmediaComments);
  };
  const [selectedPost, setSelectedPost] = useState<PostData | MediaPostData | null>(null);
 
  
  const promptDeletePost = (post: PostData | MediaPostData) => {
    console.log("promptDeletePost called with:", post);  // Log to verify it's being called
    setSelectedPost(post);
    setDialogOpenpost(true);
  };
  
  

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
        let response;
        // Check if media_url exists to determine it's a media post
        if ('media_url' in selectedPost) {
            response = await MediaService.deletemediaPost(selectedPost.id);
            // Update media posts state
            setMediaPosts(currentMediaPosts => currentMediaPosts.filter(post => post.id !== selectedPost.id));
        } else {
            response = await PostService.deletePost(selectedPost.id);
            // Update posts state
            setPosts(currentPosts => currentPosts.filter(post => post.id !== selectedPost.id));
        }

        toast.success(response.message);
        setDialogOpenpost(false);
    } catch (error) {
        console.error('Error while deleting post:', error);
        toast.error("Unauthorized to delete this post!");
        setDialogOpenpost(false);
    }
};

  
  const handleClose = () => {
    setDialogOpenpost(false);
  };
  //edit 
  const [files, setFiles] = useState<File[]>([]); // Initializes the files state

  const isMediaPost = (post: PostData | MediaPostData): post is MediaPostData => {
    return 'media_url' in post;
};

const handleEditPost = async (updatedData: PostData | FormData) => {
  if (!selectedPost) return;  // Exit if no post is selected
let response:any;
  try {
    if (isMediaPost(selectedPost)) {
      // Prepare FormData for media post
      const formData = new FormData();
      formData.append('title', selectedPost.title);
      formData.append('description', selectedPost.description);
      formData.append('mention', selectedPost.mention);

      // Append files to FormData
      if (files && files.length > 0) {
          files.forEach(file => formData.append('media', file));  // Make sure to use 'media' as the key
      }

      // Log FormData for debugging (optional)
      Array.from(formData.entries()).forEach(entry => {
        console.log(`${entry[0]}: ${entry[1] instanceof Blob ? `${entry[1].name} (size: ${entry[1].size})` : entry[1]}`);
    });
       // Debug to ensure data is correct

        response = await MediaService.editmediaPost(selectedPost.id, formData);
      } else {
        response = await PostService.editPost(selectedPost.id, updatedData as PostData);
      }
    
    
      if (response && response.id) {
        toast.success("Post updated successfully!");
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === response.id ? {...post, ...response} : post
        ));
      } else {
        throw new Error("Invalid response from the server");
      }
      
      setSelectedPost(null);  // Optionally reset the selected post
    } catch (error: any) {
      console.error('Error while editing post:', error);
      toast.error("Failed to update post!");
    }
};

// State variables for each modal type

// Function to open the correct modal based on the type of post
const openModal = (post: PostData | MediaPostData) => {
    setSelectedPost(post);
    if ('media_url' in post) {
        setShowMediaPostModal(true);  // Open media post modal
        setShowEditPostModal(false);  // Ensure regular post modal is closed
    } else {
        setShowEditPostModal(true);   // Open regular post modal
        setShowMediaPostModal(false); // Ensure media post modal is closed
    }
};

// Function to close both modals
const handleCloseModal = () => {
    setShowMediaPostModal(false);
    setShowEditPostModal(false);
    setSelectedPost(null);
};

      return (
        
        <React.Fragment>
          
            <div className="col-span-12 lg:col-span-9 xl:col-span-6 2xl:col-span-6">
            <div className="card ">

            <div className="card-body">


                        <StoryDisplay storyData={storyData} uploadStory={uploadStory} currentUserProfileImage={profileImageUrl} currentUserId={currentUserId}   />
                        </div>

                        </div>

                <div className="card">
                    <div className="card-body">
                        <div className="flex gap-3">
                            <ul className="flex gap-3 grow">
                                {/* <li>
                                    <Link to="#!"><Video className="inline-block size-4 text-red-500 ltr:mr-1 rtl:ml-1" /> <span className="align-middle text-slate-500 dark:text-zink-200">Live Video</span></Link>
                                </li> */}
                                <li>
                                    <Link to="#!" onClick={defaultToggle}><Image className="inline-block size-4 ltr:mr-1 text-custom-600 rtl:ml-1" /> <span className="align-middle text-slate-500 dark:text-zink-200">Image/Video</span></Link>
                                </li>
                                <li>
                                    <Link to="#!" onClick={defaultEventToggle}><CalendarDays className="inline-block size-4 text-green-500 ltr:mr-1 rtl:ml-1" /> <span className="align-middle text-slate-500 dark:text-zink-200">Event</span></Link>
                                </li>
                                {/* <li>
                                    <Link to="#!"><AtSign className="inline-block size-4 ltr:mr-1 text-sky-500 rtl:ml-1" /> <span className="align-middle text-slate-500 dark:text-zink-200">Mention</span></Link>
                                </li> */}
                            </ul>
                            {/* <Dropdown className="relative dropdown shrink-0">
                                <Dropdown.Trigger className="flex items-center justify-center size-[30px] dropdown-toggle p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20" id="socialMediaCreate" data-bs-toggle="dropdown"><MoreHorizontal className="size-3" /></Dropdown.Trigger>
                                <Dropdown.Content placement="right-end" className="absolute z-50 py-2 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="socialMediaCreate">
                                    <li>
                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500" to="#!"><GitPullRequest className="inline-block size-3 mr-1" /> <span className="align-middle">Create a poll</span></Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500" to="#!"><MessagesSquare className="inline-block size-3 mr-1" /> <span className="align-middle">Ask a question</span></Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500" to="#!"><HelpCircle className="inline-block size-3 mr-1" /> <span className="align-middle">Help</span></Link>
                                    </li>
                                </Dropdown.Content>
                            </Dropdown> */}
                        </div>
                        
                                <Post/>
                            
                    </div>
                </div>


                {/* {sortedPosts.map((post) => ( */}
                <div>
  {sortedPosts.map((post) => (
    <div key={post.id} className="card mb-4 w-full max-w-5xl">
      <div className="card-body">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="size-12 bg-green-100 rounded-full outline-1 outline outline-transparent outline-offset-[3px] [&.active]:outline-custom-500 shrink-0 dark:bg-green-500/20">
            <img src={`http://localhost:8000/storage/profile_images/${post.user.profile_image}`} alt="User avatar" className="size-12 rounded-full" />
          </div>
          <div className="grow">
            <h6 className="mb-1 text-15">
              <Link to="#!" className="hover:text-custom-500">{post.user?.name}</Link>
              - <small className="ml-1 font-normal text-slate-500 dark:text-zink-200">
                {formatTimeAgo(post.created_at)}
              </small>
            </h6>
            <p className="text-slate-500 dark:text-zink-200">
              {post.user?.role} at <Link to="https://www.ocpgroup.ma/fr" className="underline">{post.user?.service}</Link>
            </p>
          </div>
          <Dropdown className="relative dropdown shrink-0">
                                <Dropdown.Trigger className="flex items-center justify-center size-[30px] dropdown-toggle p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20" id="socialMediaCreate" data-bs-toggle="dropdown"><MoreHorizontal className="size-3" /></Dropdown.Trigger>
                                <Dropdown.Content placement="right-end" className="absolute z-50 py-2 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="socialMediaCreate">
                                <div>
  <li>
    <button
  className="w-full text-left px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zinc-100 dark:hover:bg-zinc-500 dark:hover:text-zinc-200 dark:focus:bg-zinc-500 dark:focus:text-zinc-200 text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500"
  onClick={() => openModal(post)}
    >
      <EditIcon className="inline-block size-3 mr-1" />    <span className="align-middle">Edit</span>
    </button>
  </li>
</div>
                                    <div>
                                    <li>
  <button
  className="w-full text-left px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zinc-100 dark:hover:bg-zinc-500 dark:hover:text-zinc-200 dark:focus:bg-zinc-500 dark:focus:text-zinc-200 text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500"
  onClick={() => promptDeletePost(post)}
  >
<TrashIcon className="inline-block size-3 mr-1" />    <span className="align-middle">Delete</span>
  </button>
</li>
</div>
   
                          
{/* <li>
                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500" to="#!"  onClick={() => openModal(post)}>
                <MessagesSquare className="inline-block size-3 mr-1" /> <span className="align-middle">Ask a question</span>
                </Link>
            </li> */}
          

                                    {/* <li>
                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500" to="#!"><HelpCircle className="inline-block size-3 mr-1" /> <span className="align-middle">Help</span></Link>
                                    </li> */}
                                </Dropdown.Content>
                                <DeleteModal show={isDialogOpenpost} onHide={handleClose} onDelete={handleDeletePost} />

                              
 {showMediaPostModal && (
      <ModalEdit
          isOpen={showMediaPostModal}
          mediaPost={selectedPost as MediaPostData}
          onClose={handleCloseModal}
      />
  )}
  {showEditPostModal && (
      <EditPostModal
          isOpen={showEditPostModal}
          post={selectedPost as PostData}
          onClose={handleCloseModal}
          onSave={handleEditPost as any}  // Ensure proper typing
      />
  )}


       
                            </Dropdown>
        </div>

        {'media_url' in post ? (
          <>
            <p className="font-bold text-slate-900 dark:text-gray-400 mt-5 mb-5">{post.title}</p>
            <div className="text-slate-900 dark:text-gray-400 mt-5 mb-5">{post.description}</div>
            {post.media_url && (
    /\.(jpeg|jpg|gif|png)$/i.test(post.media_url) ? (
        <img src={`http://localhost:8000/storage/${post.media_url}`} alt="Post Media" className="w-full max-h-96 rounded-lg object-cover" />
    ) : /\.(mp4|mov|avi)$/i.test(post.media_url) ? (
      <video controls className="w-full max-h-96 rounded-lg object-cover">
      <source src={`http://localhost:8000/storage/${post.media_url}`} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    ) 
    : /\.pdf$/i.test(post.media_url) ? (
      <iframe src={`http://localhost:8000/storage/${post.media_url}`}  className="w-full h-64"></iframe>
  ) : (
    <div className="card rounded-md bg-slate-100 dark:bg-zinc-600 text-slate-900 dark:text-gray-400">
    <div className="card-body flex items-center gap-3">
        <a href={`http://localhost:8000/storage/${post.media_url}`} download={post.media_url} className="dark:text-gray-400 flex items-center">
            <DownloadCloudIcon className="mr-2" />
            <span>Download file</span>
        </a>
    </div>
</div>


  )) || (
    <p>Format de fichier non pris en charge</p>
)}

            <div className="text-sm font-semibold text-gray-400 mt-5 mb-5">
<span className="text-blue-600 underline">{post.mention}</span>
</div>

            {/* Media post interaction bar */}
            <div className="border-y border-slate-200 card-body dark:border-zink-500">
              <ul className="flex items-center gap-4 mb-0">
                {/* Placeholder for media-specific interactions */}
                <MediaCommentCount mediapostId={post.id} onTogglemediaComments={togglemediaCommentsVisibility} />

                <LikeMedia mediapostId={post.id} />
                <div className="relative">
                      {/* Other post content */}
                      <button onClick={() => shareMediaPost(post.id)} className="share-button text-slate-500 dark:text-zink-200">
                        <Send className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                        <span className="align-middle">Share</span>
                      </button>

                      {/* Dropdown menu, visibility controlled by checking if activeDropdown matches this post's ID */}
                      <div className={`absolute left-0 w-96 bg-white dark:bg-gray-800 p-4 flex justify-evenly items-center shadow-lg z-50 ${activeMediaPostDropdown === post.id ? 'flex' : 'hidden'}`}>
                        <span className="text-gray-800 dark:text-slate-500 font-semibold">Share with</span>
                        <div className="flex space-x-4">
                          {/* Share links, which close the dropdown and are only visible when this post's dropdown is active */}
                          <a href="https://www.facebook.com/sharer/sharer.php?u=YourURLHere"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={facebook} alt="Facebook" className="h-8 mx-auto" />
                          </a>

                          <a href="mailto:email@example.com?subject=Email%20Subject&body=Email%20Body"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={email} alt="Email" className="h-8 mx-auto" />
                          </a>

                          <a href="https://www.instagram.com/?url=YourURLHere"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={instagram} alt="Instagram" className="h-8 mx-auto" />
                          </a>
                          <a href="OCPLINK"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={OCPLINK} alt="OCPLINK" className="h-8 mx-auto" />
                          </a>
                          <a href="https://twitter.com/intent/tweet?url=YourURLHere&text=YourTextHere"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={twitter} alt="Twitter" className="h-8 mx-auto" />
                          </a>

                          <a href="https://www.linkedin.com/sharing/share-offsite/?url=YourURLHere"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={linkedin} alt="LinkedIn" className="h-8 mx-auto" />
                          </a>

                          <a href="https://t.me/share/url?url=YourURLHere&text=YourTextHere"
                            onClick={() => setActiveMediaPostDropdown(null)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            <img src={telegram} alt="Telegram" className="h-8 mx-auto" />
                          </a>
                          {/* Add more icons as needed */}
                        </div>
                      </div>
                    </div>

                    <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

<li className="ltr:ml-auto rtl:mr-auto">
    <button onClick={() => handleTogglemediaFavorite(post.id)} className="text-slate-500 dark:text-zink-200 flex items-center">
        <Bookmark className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
        <span className="align-middle">({post.favorites_count})</span>
    </button>
</li>


              </ul>
            </div>
            <MediaComment mediapostId={post.id} />
            {showmediaComments && <MediaCommentdisplay mediapostId={post.id} />}

          </>
        ) : (
          <>
            <p className="text-slate-900 dark:text-gray-400 mb-5">{post.content}</p>
            <div className="border-y border-slate-200 card-body dark:border-zink-500">
              <ul className="flex items-center gap-4 mb-0">
                {/* Placeholder for post interactions */}
                <CommentCount postId={post.id} onToggleComments={toggleCommentsVisibility} />
                
                <LikeComponent postId={post.id} />
                <div className="relative">
                        {/* Other post content */}
                        <button onClick={() => handleShare(post.id)} className="share-button text-slate-500 dark:text-zink-200">
                          <Send className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                          <span className="align-middle">Share</span>
                        </button>

                        {/* Dropdown menu, visibility controlled by checking if activeDropdown matches this post's ID */}
                        <div className={`absolute left-0 w-96 bg-white dark:bg-gray-800 p-4 flex justify-evenly items-center shadow-lg z-50 ${activeDropdown === post.id ? 'flex' : 'hidden'}`}>
                          <span className="text-gray-800 dark:text-slate-500 font-semibold">Share with</span>
                          <div className="flex space-x-4">
                            {/* Share links, which close the dropdown and are only visible when this post's dropdown is active */}
                            <a href="https://www.facebook.com/sharer/sharer.php?u=YourURLHere"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={facebook} alt="Facebook" className="h-8 mx-auto" />
                            </a>

                            <a href="mailto:email@example.com?subject=Email%20Subject&body=Email%20Body"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={email} alt="Email" className="h-8 mx-auto" />
                            </a>

                            <a href="https://www.instagram.com/?url=YourURLHere"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={instagram} alt="Instagram" className="h-8 mx-auto" />
                            </a>
                            <a href="OCPLINK"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={OCPLINK} alt="OCPLINK" className="h-8 mx-auto" />
                            </a>
                            <a href="https://twitter.com/intent/tweet?url=YourURLHere&text=YourTextHere"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={twitter} alt="Twitter" className="h-8 mx-auto" />
                            </a>

                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=YourURLHere"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={linkedin} alt="LinkedIn" className="h-8 mx-auto" />
                            </a>

                            <a href="https://t.me/share/url?url=YourURLHere&text=YourTextHere"
                              onClick={() => setActiveDropdown(null)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                              <img src={telegram} alt="Telegram" className="h-8 mx-auto" />
                            </a>
                            {/* Add more icons as needed */}
                          </div>
                        </div>
                      </div>



                      <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

<li className="ltr:ml-auto rtl:mr-auto">
    <button onClick={() => { 
        handleToggleFavorite(post.id)
           
    }} className="text-slate-500 dark:text-zink-200 flex items-center">
        <Bookmark className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
        <span className="align-middle">({post.favorites_count})</span>
    </button>
</li>

              </ul>
            </div>
            <Comment postId={post.id}  />
            {/* <Commentdisplay postId={post.id}   /> */}
        {showComments && <Commentdisplay postId={post.id} />}
      {/* Other components */}
            

          </>
        )}
      </div>
    </div>
  ))}
</div>
 
         
         
    
                <div className="flex justify-center mb-5">
                    <button type="button" className="flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                        <svg className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Load More
                    </button>
                </div>
            </div>

            {/* LightBox */}
            <Lightbox
                index={index}
                slides={slideGallery}
                open={index >= 0}
                close={() => setIndex(-1)}
            />

            {/* Story LightBox */}
            <Lightbox
                open={storyBox}
                close={() => setStoryBox(false)}
                slides={[{ src: "https://cdn.dribbble.com/userupload/3012253/file/original-dd6cf163ea8f5617304d9d41f6ff38e7.png?resize=448x506" }]}
            />

            {/* Image/Video Modal */}
            <Modal show={defaultModal} onHide={defaultToggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500">
                    <Modal.Title className="text-16">Add Post Image / Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form onSubmit={handleMediaPostSubmit}>
                        <div className="mb-4">
                            <label htmlFor="postTitle" className="inline-block mb-2 text-base font-medium">Post Title</label>
                            <input type="text" id="postTitle" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter title" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="descriptionInput" className="inline-block mb-2 text-base font-medium">Description</label>
                            <textarea className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="descriptionInput" rows={3}></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="mentionUserSelect" className="inline-block mb-2 text-base font-medium">@Mention</label>
                            <input className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="mentionUserSelect" data-choices data-choices-text-unique-true type="text"/>
                        </div>
                        <div className="mb-4">


                            <label className="inline-block mb-2 text-base font-medium">Images / Video</label>
                            <Dropzone
                                onDrop={(acceptfiles: any) => {
                                    handleAcceptfiles(acceptfiles);
                                }}>
                                {({ getRootProps }: any) => (
                                    <div className="flex items-center justify-center bg-white border border-dashed rounded-md cursor-pointer dropzone border-slate-300 dropzone2 dark:bg-zink-700 dark:border-zink-500">
                                        <div className="w-full py-5 text-lg text-center dz-message needsclick" {...getRootProps()} >
                                            <div className="mb-3">
                                                <UploadCloud className="block size-12 mx-auto text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-600" />
                                            </div>
                                            <h5 className="mb-0 font-normal text-slate-500 dark:text-zink-200 text-15">Drag and drop your images / video or <Link to="#!">browse</Link> your images / video</h5>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>

                            <ul className="flex flex-wrap mb-0 gap-x-5" id="dropzone-preview2">
                                {
                                    (selectfiles || [])?.map((file: any, index: number) => {
                                        return (
                                            <li className="mt-5" id="dropzone-preview-list2">
                                                <div className="border rounded border-slate-200 dark:border-zink-500">
                                                    <div className="p-2 text-center">
                                                        <div>
                                                            <div className="p-2 mx-auto rounded-md size-14 bg-slate-100 dark:bg-zink-500">
                                                                <img className="block w-full h-full rounded-md" src={file.priview} alt={file.name} />
                                                            </div>
                                                        </div>
                                                        <div className="pt-3">
                                                            <h5 className="mb-1 text-15">{file.path}</h5>
                                                            <p className="mb-0 text-slate-500 dark:text-zink-200">{file.formattedSize}</p>
                                                            <strong className="text-red-500 error"></strong>
                                                        </div>
                                                        <div className="mt-2">
                                                            <button className="px-2 py-1.5 text-xs text-white bg-purple-500 border-purple-500 btn hover:text-white hover:bg-purple-600 hover:border-purple-600 focus:text-white focus:bg-purple-600 focus:border-purple-600 focus:ring focus:ring-purple-100 active:text-white active:bg-purple-600 active:border-purple-600 active:ring active:ring-purple-100 dark:ring-purple-400/10" onClick={() => {
                                                                const newImages = [...selectfiles];
                                                                newImages.splice(index, 1);
                                                                setSelectfiles(newImages);
                                                            }}>Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Share Post</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Event Modal */}
            <Modal show={defaultEventModal} onHide={defaultEventToggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500">
                    <Modal.Title className="text-16">Add Post Image / Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form action="#!">
                        <div className="mb-4">
                            <label htmlFor="eventTitle" className="inline-block mb-2 text-base font-medium">Title</label>
                            <input type="text" id="eventTitle" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Event title" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="eventDateInput" className="inline-block mb-2 text-base font-medium">Event Date</label>
                            <Flatpickr
                                id="eventDateInput"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 flatpickr-input"
                                options={{
                                    dateFormat: "d M, Y"
                                }}
                                placeholder='Select date'
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="eventTimeInput" className="inline-block mb-2 text-base font-medium">Event Time</label>
                            <Flatpickr
                                id="eventTimeInput"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 flatpickr-input"
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                }}
                                placeholder='Select Time'
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="descriptionEventInput" className="inline-block mb-2 text-base font-medium">Description</label>
                            <textarea className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="descriptionEventInput" rows={2}></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="inline-block mb-2 text-base font-medium">Location</label>
                            <input className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="location" type="text" placeholder="Enter location" />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Create Event</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    );
};

export default CommentFeed;