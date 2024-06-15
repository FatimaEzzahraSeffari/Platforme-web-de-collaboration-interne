import React, { useEffect, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';

// Icons
import { Search, Plus, BadgeCheck, Home, UserRound, CalendarDays, Clapperboard, ShoppingCart, Settings, PlaySquare, Mail, LogOut, Bookmark, DeleteIcon, Trash } from 'lucide-react';

// Images
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

import adwords from "assets/images/brand/adwords.png";
import twitter from "assets/images/brand/twitter.png";
import meta from "assets/images/brand/meta.png";
import thumbnail from "assets/images/thumbnail.png";
import figma from "assets/images/brand/figma.png";
import { Link } from 'react-router-dom';
import authService, { logout } from 'services/authService';
import LightDark from 'Common/LightDark';
import PostService from 'services/PostService';
import VideoUploadModal from './VideoUploadModal';
import { deleteVideo, fetchVideos } from 'services/uploadService';
import DeleteModal from 'Common/DeleteModal';
import {ToastContainer, toast} from 'react-toastify';
import TotalFavorites from 'pages/Components/Posts/TotalFavorites';
import TotalVideos from 'pages/Components/Posts/TotalVideos';

interface Video {
    id: number;
    title: string;
    thumbnail: string;
    url: string;
  }
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
const WatchVideo = () => {
    const handleLogout = () => {
        logout(); // Appeler la fonction logout lors du clic sur le lien "Sign Out"
    };
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const [videos, setVideos] = useState<Video[]>([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
    ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
    : undefined;




    const fetchAndUpdate = async () => {
        try {
            const fetchedVideos = await fetchVideos();
            setVideos(fetchedVideos);
        } catch (error) {
            console.error('Error fetching videos', error);
        }
    };

    useEffect(() => {
        fetchAndUpdate();
        const intervalId = setInterval(fetchAndUpdate, 1000); // Refresh every 5 seconds
        
        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);
    const handleNewVideo = (newVideo: Video) => {
        setVideos(prevVideos => [newVideo, ...prevVideos]);
    };

    //destroy
    const handleDeleteVideo = async () => {
        if (selectedVideoId) {
          try {
            await deleteVideo(selectedVideoId); // Appelez la fonction deleteVideo
            setIsDialogOpen(false);
            toast.success("The video deleted successfully !");

        } catch (error) {
            console.error('Error deleting video:', error);
            // Handle the error appropriately in your UI
          }
        }
      };
    
      const handleClose = () => {
        setIsDialogOpen(false);
      };
    
      const promptDeleteVideo = (videoId: string) => {
        setSelectedVideoId(videoId);
        setIsDialogOpen(true);
      };
    
    
  const formatEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Error formatting embed URL:', error);
      // If it's not a valid URL, assume it's a local file path
      return `http://localhost:8000/storage/videos/${url}`;
    }
  };
  //search
  const filteredVideos = videos.filter(video =>
    video.title && video.title.toLowerCase().includes(searchTerm.toLowerCase())
);
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
<div className="h-5"></div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
                <div className="xl:col-span-3">
                    <div className="card ml-1">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="rounded-full bg-slate-100 dark:bg-zink-600 shrink-0">
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
</div>                                                                <p className="text-slate-500 dark:text-zink-200"><span className="relative -top-6">@</span>
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
                                <li className="group grow">
                                    <Link to="/apps-social-friends" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><UserRound className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Collaborators</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-social-event" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><CalendarDays className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Event</span></Link>
                                </li>
                                <li className="group grow active">
                                    <Link to="/apps-social-video" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Clapperboard className="inline-block size-4 align-middle ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Watch Video</span></Link>
                                </li>
                                <li className="group grow">
                                    <Link to="/apps-chat" className="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><Mail className="inline-block size-4 ltr:mr-2 rtl:ml-2"></Mail>  <span className="align-middle">Inbox</span></Link>
                                </li>
                                <li className="group grow">
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
                            <h6 className="mb-4 text-15">Active Collaborators</h6>
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
                <div className="xl:col-span-9">
                    <div className="grid items-center grid-cols-1 gap-4 mb-4 xl:grid-cols-12">
                        
                        <div className="flex gap-2 xl:col-span-4 xl:col-start-1">
                            <div className="relative grow">
                            <input
                                    type="text"
                                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    placeholder="Search for ..."
                                    autoComplete="off"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />                                <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                            </div>
                            {currentUser.user.role === 'Collaborator' && (
                            <button type="button"onClick={() => setIsModalOpen(true)} className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20  " style={{ width: '190px' }}>
                                <Plus className="inline-block size-4" />Add Video
                            </button>
)}
                        </div>
                    </div>
                    <VideoUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}     onNewVideo={handleNewVideo}
 />

                    <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-12">
                        <div className="md:col-span-12 xl:row-span-6 xl:col-span-8">
                            <div className="relative h-full bg-white rounded-md dark:bg-zink-600">
                                <h3 className="absolute inset-0 flex items-center justify-center">Welcome to &nbsp;<span className="text-sky-500"> OCPLINK Platform</span> 🤩</h3>
                                <iframe name="iframe_a" className="relative w-full h-full rounded-md aspect-video" title="Iframe Example"></iframe>
                            </div>
                        </div>


                       
                              {filteredVideos.map(video => (
                                
        <div key={video.id} className="md:col-span-6 xl:row-span-3 xl:col-span-4">

                            <Link to={formatEmbedUrl(video.url)} target="iframe_a" className="block !mb-0 card relative">
                                <div className="card-body">
                                    <div className="absolute flex items-center justify-center size-12 -translate-x-1/2 rounded-full bg-white/70 top-1/2 left-1/2">
                                        <PlaySquare className="text-red-800" />
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                <h6 className="truncate text-15">{video.title}</h6>
                {currentUser.user.role === 'Collaborator' && (

                <Trash
                  className="text-red-500 cursor-pointer"
                  onClick={() => promptDeleteVideo(video.id.toString())}

                />
            )}

              </div>               <img src={thumbnail} alt="" className="object-cover w-full rounded-md h-44" />
                                </div>
                            </Link>
                                    </div>

                         ))}
                               <DeleteModal show={isDialogOpen} onHide={handleClose} onDelete={handleDeleteVideo} />

                        </div>

                             
                        <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

                        
                    </div>
                </div>
        </React.Fragment>
    );
};

export default WatchVideo;
