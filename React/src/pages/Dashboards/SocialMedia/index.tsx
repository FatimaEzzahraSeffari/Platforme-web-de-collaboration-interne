import React, { useEffect, useState } from "react";
import { Bookmark, LogOut, Mail } from 'lucide-react';

// Images
import avatar1 from "assets/images/users/avatar-1.png";

import adwords from "assets/images/brand/adwords.png";
import twitter from "assets/images/brand/twitter.png";
import meta from "assets/images/brand/meta.png";
import figma from "assets/images/brand/figma.png";

import { activeFriendsData } from "Common/data";

// Icons
import { BadgeCheck, Home, UserRound, CalendarDays, Clapperboard, ShoppingCart, Settings } from 'lucide-react';
import { Link, useParams } from "react-router-dom";
import Messages from "./Messages";
import CommentFeed from "./CommentFeed";
import authService, { logout } from "../../../services/authService"; 
import LightDark from "Common/LightDark";
import Post from "pages/Components/Posts/Post";
import axios from "axios";
import PostService from "services/PostService";
import LanguageDropdown from "Common/LanguageDropdown";
import FavoritesService from "services/FavoritesService";
import TotalFavorites from "pages/Components/Posts/TotalFavorites";
import TotalVideos from "pages/Components/Posts/TotalVideos";
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
    online: boolean;

  }
  interface UserProfileProps {
    users: User[];
  }
const SocialMediaDashboard = () => {
    const handleLogout = () => {
        logout(); // Appeler la fonction logout lors du clic sur le lien "Sign Out"
    };
    const { postId } = useParams();

    const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Construct the profile image URL using the profile_image from currentUser.user
  const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
    ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
    : undefined;
// Replace with your actual default image path
    document.title = "OCPLINK | Collaboration platform  ";
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
    //total favorites 
   
    
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
        const interval = setInterval(fetchUsers, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }
    
}, [currentUser]);
    return (
        
        <React.Fragment>

            <div className="grid grid-cols-12 mt-5 gap-x-5">
           
                <div className="col-span-12 lg:col-span-5 xl:col-span-3 shrink-0 lg:block">
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
                                            {/* <LanguageDropdown /> */}

                                        </div>
                                    </div>           
                                    <p className="text-slate-500 dark:text-zink-200 ">
                                    <span className="relative -top-6">@</span>
                                        {currentUser && currentUser.user && currentUser.user.role
                                            ? <span className="relative -top-6">{currentUser.user.role}</span>  // Tailwind CSS for relative positioning and negative top
                                            : <span></span>
                                        }</p>
                                </div>

                            </div>
                            <div className="grid grid-cols-1 text-center divide-y sm:divide-y-0 sm:divide-x sm:grid-cols-3 divide-slate-200 dark:divide-zink-500 divide-dashed rtl:divide-x-reverse ">
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
                            <ul className="flex flex-col w-full gap-2 mb-4 text-sm font-medium shrink-0 nav-tabs ">
                                <li className="group grow active">
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
                                <li className="group grow">
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
                    {/* <div className="card">
                        <div className="card-body">
                        <h6 className="mb-4 text-15">Active Friends</h6>
<div className="flex flex-wrap items-center gap-3">
  {(activeFriendsData || [])
    .filter((item: any) => item.online) // Filter to only include online users
    .map((item: any, key: number) => (
      <React.Fragment key={key}>
        {key <= 8 ? (
          <Link to={`#/profile/${item.id}`} className="relative">
            <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="h-10 w-10 border rounded-full border-slate-200 dark:border-zink-500" />
            <span className="top-0 ltr:right-0 rtl:left-0 absolute size-2.5 bg-green-400 border-2 border-white dark:border-zink-700 rounded-full"></span>
          </Link>
        ) : key === 9 && (
          <Link to="#!" className="relative flex items-center justify-center size-10 rounded-full bg-custom-100 text-custom-500 dark:bg-custom-500/20">
            {activeFriendsData.length - 9}+
          </Link>
        )}
      </React.Fragment>
    ))}
</div>

                        </div>
                    </div> */}
                </div>
                    
                <CommentFeed postId={Number(postId)} mediapostId={0} />

                <Messages />
            </div>
        </React.Fragment >
    );
};

export default SocialMediaDashboard;