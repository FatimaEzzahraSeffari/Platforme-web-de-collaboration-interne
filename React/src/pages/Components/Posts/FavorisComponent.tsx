import { Link, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Images
import adwords from "assets/images/brand/adwords.png";
import twitter from "assets/images/brand/twitter.png";
import meta from "assets/images/brand/meta.png";
import figma from "assets/images/brand/figma.png";
import avatar1 from "assets/images/users/avatar-1.png";
import avatar2 from "assets/images/users/avatar-2.png";
import avatar3 from "assets/images/users/avatar-3.png";
import avatar4 from "assets/images/users/avatar-4.png";
import avatar5 from "assets/images/users/avatar-5.png";
import avatar6 from "assets/images/users/avatar-6.png";
import avatar7 from "assets/images/users/avatar-7.png";
import avatar8 from "assets/images/users/avatar-8.png";
import avatar9 from "assets/images/users/avatar-9.png";
import avatar10 from "assets/images/users/avatar-10.png";

import { activeFriendsData } from "Common/data";
import SimpleBar from "simplebar-react";
import { storyData } from "Common/data";
import MediaCommentCount from "pages/Components/Posts/MediaCommentCount";
import MediaComment from "pages/Components/Posts/MediaComment";
import LikeMedia from "pages/Components/Posts/likemedia";
import MediaCommentdisplay from "pages/Components/Posts/MediaCommentDisplay";

// Icons
import { BadgeCheck, Home, UserRound, CalendarDays, Clapperboard, ShoppingCart, Settings, Mail, Bookmark, LogOut, Plus, UserRoundX, GitPullRequest, MessagesSquare, HelpCircle, MoreHorizontal, Send, DownloadCloudIcon } from 'lucide-react';
import { useParams } from "react-router-dom";

import LightDark from "Common/LightDark";
import Post from "pages/Components/Posts/Post";
import SocialMediaDashboard from 'pages/Dashboards/SocialMedia';
import authService, { logout } from 'services/authService';
import PostService, { PostData } from 'services/PostService';
import { FavoritesService } from 'services/FavoritesService';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
    getSocialFriends as onGetSocialFriends
} from 'slices/thunk';
import { Dropdown } from "Common/Components/Dropdown";

import smallImg3 from "assets/images/small/img-3.jpg";
import smallImg5 from "assets/images/small/img-5.jpg";
import smallImg6 from "assets/images/small/img-6.jpg";
import Commentdisplay from './Commentdisplay';
import CommentCount from './CommentCount';
import LikeComponent from './LikeComponent';
import whatssap from "assets/images/Whatssap.png";
import messenger from "assets/images/messanger.png";
import facebook from "assets/images/facebook.png";
import instagram from "assets/images/instagram.png";
import twitter1 from "assets/images/twitter.png";
import linkedin from "assets/images/linkedin.png";
import telegram from "assets/images/telegram.png";
import OCPLINK from "assets/images/OCPLINK.png";

import email from "assets/images/gmail.png";
import { ToastContainer, toast } from 'react-toastify';
import { MediaPostData } from 'services/MediaService';
import Comment from "pages/Components/Posts/Comment";
import TotalFavorites from './TotalFavorites';
import TotalVideos from './TotalVideos';
interface User {
  id: number;
  roomId: number;
  name: string;
  profile_image?: string;
  status?: string;
  role?: string;
  country_code?: string;
  phone: string;
  email?:string;
  countryCode: string; // Add countryCode to User interface

}
interface UserProfileProps {
  users: User[];
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
const FavorisComponent: React.FC = () => {
  const [favorites, setFavorites] = useState<PostData[]>([]);
  const [mediafavorites, setmediaFavorites] = useState<MediaPostData[]>([]);

const [favoriteCounts, setFavoriteCounts] = useState({});

useEffect(() => {
  const loadFavorites = async () => {
    try {
      const favoritePosts = await FavoritesService.fetchFavorites();
      setFavorites(favoritePosts || []);
      console.log('Favorites Loaded:', favoritePosts);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };
  loadFavorites();
}, []);

useEffect(() => {

  const loadMediaFavorites = async () => {
    try {
      const mediaFavoritePosts = await FavoritesService.fetchmediaFavorites();
      setmediaFavorites(mediaFavoritePosts || []);
      console.log('Media Favorites Loaded:', mediaFavoritePosts);
    } catch (error) {
      console.error('Error loading media favorites:', error);
    }
  };

  loadMediaFavorites();
}, []);

  
  // Handle toggle favorite
  const handleToggleFavorite = async (postId: number) => {
    try {
      const response = await FavoritesService.toggleFavorite(postId);
      // Update the local state with the new favorite count
      setFavorites(prevFavorites => prevFavorites.map(post => 
        post.id === postId ? {...post, favorites_count: response.favorites_count} : post
      ));
      if (response.isFavorited) {
        toast.success("Added to favorites!");
    } else {
        console.log("Should show toast for removing from favorites");
        toast.info("Removed from favorites!");
        setFavorites(prevFavorites => prevFavorites.filter(post => post.id !== postId));
    }
    

    } catch (error) {
      console.error('Failed to toggle favorite:', error);

    }
  };
  //mediapost favourite 

  
  
  
  // Handle toggle favorite
  const handleTogglemediaFavorite = async (mediapostId: number) => {
    try {
        const response = await FavoritesService.togglemediaFavorite(mediapostId);
        setmediaFavorites(prevFavorites => {
          console.log('Media Favorites Loaded:', mediafavorites); // Check what is being loaded

          return prevFavorites.map(mediapost => {
              if (mediapost.id === mediapostId) {
                    return {...mediapost, favorites_count: response.favorites_count};
                }
                return mediapost;
            });
        });
        if (response.isFavorited) {
          toast.success("Added to favorites!");
      } else {
          console.log("Should show toast for removing from favorites");
          toast.info("Removed from favorites!");
          setmediaFavorites(prevMediaFavorites => prevMediaFavorites.filter(mediaPost => mediaPost.id !== mediapostId));
        }
      

    } catch (error) {
        console.error('Failed to toggle favorite:', error);
    }
};

  
  
  const handleLogout = () => {
    logout(); // Appeler la fonction logout lors du clic sur le lien "Sign Out"
};
const storedUser = localStorage.getItem('user');
const currentUser = storedUser ? JSON.parse(storedUser) : null;

// Construct the profile image URL using the profile_image from currentUser.user
const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
  ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
  : undefined;
// Replace with your actual default image path
const dispatch = useDispatch<any>();


  // Construct the profile image URL using the profile_image from currentUser.user
 
// Replace with your actual default image path
const selectDataList = createSelector(
    (state: any) => state.Social,
    (state) => ({
        dataList: state.friendslist
    })
);

const { dataList } = useSelector(selectDataList);

const [data, setData] = useState<any>([]);

// Get Data


const [type, setType] = useState<string>("Following");





const [index, setIndex] = useState<any>(-1);

const productGallery = [smallImg6, smallImg3, smallImg5];

const slideGallery = productGallery.map((item: any) => ({ "src": item }));

// Story LightBox
const [storyBox, setStoryBox] = useState<boolean>(false);

// Add/Edit Modal
const [defaultModal, setDefaultModal] = useState<boolean>(false);
const defaultToggle = () => setDefaultModal(!defaultModal);

const [defaultEventModal, setDefaultEventModal] = useState<boolean>(false);
const defaultEventToggle = () => setDefaultEventModal(!defaultEventModal);

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
  const hasFavorites = favorites.length > 0;
const hasMediaFavorites = mediafavorites.length > 0;
const sortedPosts = hasFavorites || hasMediaFavorites ? 
  [...favorites, ...mediafavorites].sort((a, b) => {
    // Utilisez une valeur de temps très élevée pour les éléments sans date de favoris
    const favoriteDateA = a.favorites_created_at ? new Date(a.favorites_created_at).getTime():0;
    const favoriteDateB = b.favorites_created_at ? new Date(b.favorites_created_at).getTime() :0;

    return favoriteDateA - favoriteDateB; // Tri par date croissante, inversez pour décroissante
  }) : [];

  const [showComments, setShowComments] = useState(false);
  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };
  const [showmediaComments, setShowmediaComments] = useState(false);
  const togglemediaCommentsVisibility = () => {
    setShowmediaComments(!showmediaComments);
  };
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
      const fetchTotalPosts = async () => {
          try {
              const userId = currentUser && currentUser.user ? currentUser.user.id : null;
              if (userId) {
                  const total = await PostService.getTotalPostsByUser(userId);
                  setTotalPosts(total);
              }
          } catch (error) {
              console.error('Failed to fetch total posts:', error);
          }
      };

      fetchTotalPosts();
  }, [currentUser]);
 // fetch users 
 const [users, setUsers] = useState([]);
 const [userList, setUserList] = useState([]);
 const [activeFriendsData, setActiveFriendsData] = useState<User[]>([]);
 
 useEffect(() => {
     const fetchUsers = async () => {
         try {
             const fetchedUsers = await authService.getUsers();
             const filteredUsers = fetchedUsers.filter((user:any) => user.id !== currentUser.user.id);
             setUsers(filteredUsers);
             setActiveFriendsData(filteredUsers); // Initialize active friends with filtered users
         } catch (error:any) {
             console.error('Error fetching users:', error.message);
         }
     };
 
     if (currentUser) {
         fetchUsers();
     }
 }, [currentUser]);
  return (
    
    <React.Fragment>
        
                
            <div className="grid grid-cols-1 xl:grid-cols-12 mt-5 gap-x-5">
                <div className="xl:col-span-3">
                    <div className="card ml-1">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="rounded-full bg-slate-100 shrink-0 dark:bg-zink-600">
                                    <img src={profileImageUrl} alt="Current User" className="size-12 rounded-full" />
                                </div>
                                <div className="grow">
                                <div className="flex justify-between items-center">
    <h6 className="mb-1 text-15 flex items-center">
    {
  currentUser && currentUser.user && currentUser.user.name
  ? <span>{currentUser.user.name} <BadgeCheck className="inline-block size-4 text-sky-500 fill-sky-100 dark:fill-sky-500/20 ml-2" /></span>
  : <span>Unknown User</span>
}
    </h6>
    <div>
        <LightDark />
    </div>
</div>                         
                                    <p className="text-slate-500 dark:text-zink-200"><span className="relative -top-6">@</span>
                                        {currentUser && currentUser.user && currentUser.user.role
                                            ? <span className="relative -top-6">{currentUser.user.role}</span>  // Tailwind CSS for relative positioning and negative top
                                            : <span></span>
                                        }</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 text-center divide-y sm:divide-y-0 sm:divide-x sm:grid-cols-3 divide-slate-200 dark:divide-zink-500 divide-dashed rtl:divide-x-reverse">
                                <div className="py-3 sm:py-0 sm:px-3">
                                <h6>{totalPosts}</h6>
                                    <p className="text-slate-500 dark:text-zink-200">Posts</p>
                                </div>
                                <TotalFavorites />

                                <TotalVideos />

                            </div>
                        </div>
                    </div>
                    <div className="card ml-1">
                        <div className="card-body">
                            <ul className="flex flex-col w-full gap-2 mb-4 text-sm font-medium shrink-0 nav-tabs">
                                <li className="group grow">
                                    <Link to="/dashboards-social" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Home className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Feed</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-social-calendar" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><CalendarDays className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Calendar</span></Link>
                                </li>
                                <li className="group grow ">
                                    <Link to="/apps-social-friends" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><UserRound className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Collaborators</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-social-event" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><CalendarDays className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Event</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-social-video" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Clapperboard className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Watch Video</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-chat" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Mail className="inline-block size-4 ltr:mr-2 rtl:ml-2"></Mail>  <span className="align-middle">Inbox</span></Link>
                                </li>
                                <li className="group grow active">
                                <Link to="/apps-favoris" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Bookmark className="inline-block size-4 ltr:mr-1 rtl:ml-1" />  <span className="align-middle">Favoris</span></Link>
                            </li>
                                <li className="group grow">
                                    <Link to="/pages-account-settings" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Settings className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Settings</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/logout"onClick={handleLogout} className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><LogOut className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" ></LogOut><span className="align-middle">Sign Out</span></Link>
                                    
                                </li>
                            </ul>
                            {/* <p className="mb-4 text-slate-500 dark:text-zink-200">Suggestion Pages</p>
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link to="#!" className="flex gap-3">
                                        <img src={adwords} alt="" className="h-5" />
                                        <h6>Harmonious Team</h6>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!" className="flex gap-3">
                                        <img src={twitter} alt="" className="h-5" />
                                        <h6>Twitter</h6>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!" className="flex gap-3">
                                        <img src={meta} alt="" className="h-5" />
                                        <h6>Design Stack</h6>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!" className="flex gap-3">
                                        <img src={figma} alt="" className="h-5" />
                                        <h6>UI / UX Community</h6>
                                    </Link>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">Active Friends</h6>
                            <div className="flex flex-wrap items-center gap-3">
                            {(activeFriendsData || [])
                    .filter((item: any) => item.online) // Filter to only include online users
                    .map((item: any, key: number) => (
                        <React.Fragment key={key}>
                            {key <= 8 ? (<Link to={`#/profile/${item.id}`} className="relative">
                                            <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="h-10 w-10 border rounded-full border-slate-200 dark:border-zink-500" />
                                            <span className="top-0 ltr:right-0 rtl:left-0 absolute size-2.5 bg-green-400 border-2 border-white dark:border-zink-700 rounded-full"></span>
                                        </Link>) : key === 9 && (<Link to="#!" className="relative flex items-center justify-center size-10 rounded-full bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                                            {activeFriendsData.length - 9}+
                                        </Link>)}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="col-span-12 lg:col-span-7 xl:col-span-9 2xl:col-span-6 mr-1">

  {sortedPosts.length > 0 ? 
    sortedPosts.map((post) => (
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
            </div>
    
            {'media_url' in post ? (
              <>
                <p className="font-bold text-slate-900 dark:text-gray-400">{post.title}</p>
                <div className="text-slate-900 dark:text-gray-400">{post.description}</div>
                {post.media_url && (
    /\.(jpeg|jpg|gif|png)$/.test(post.media_url) ? (
        <img src={`http://localhost:8000/storage/${post.media_url}`} alt="Post Media" className="w-full max-h-96 rounded-lg object-cover" />
    ) : /\.(mp4|mov|avi)$/.test(post.media_url) ? (
        <video controls className="w-full max-h-96 rounded-lg object-cover">
            <source src={`http://localhost:8000/storage/${post.media_url}`} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    ) 
    : /\.pdf$/.test(post.media_url) ? (
      <iframe src={`http://localhost:8000/storage/${post.media_url}`}  className="w-full h-64"></iframe>
  ) : (
    <div className="card rounded-md bg-slate-100 dark:bg-zinc-600 text-slate-900 dark:text-gray-400 mt-5 mb-5">
    <div className="card-body flex items-center gap-3 ">
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
                <MediaCommentdisplay mediapostId={post.id} />
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
                            <button onClick={() => handleToggleFavorite(post.id)} className="text-slate-500 dark:text-zink-200 flex items-center">
                              <Bookmark className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                              <span className="align-middle">({post.favorites_count})</span>
                            </button>
                          </li>
                  </ul>
                </div>
                <Comment postId={post.id} />
                <Commentdisplay postId={post.id}  />
              </>
            )}
          </div>
        </div>
      ))
       : (
        <div className="col-span-12 lg:col-span-7 xl:col-span-9 2xl:col-span-6 mr-1">
        <div  className="card mb-4 w-full max-w-5xl">
        <div className="card-body">

        <p className="dark:text-gray-400">You have no favorites yet.</p>
        </div>
        </div>  
         </div>


      )}
    </div>
    </div>

    </React.Fragment>
  );
};

export default FavorisComponent;
