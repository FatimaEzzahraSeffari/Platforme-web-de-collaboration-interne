import React, { ChangeEvent, useEffect, useState } from "react";
import { BadgeCheck, Calendar, Dribbble, Facebook, Github, Globe, ImagePlus, Instagram, Linkedin, Mail, MapPin, MoreHorizontal, UserCircle } from "lucide-react";
import { Dropdown } from "Common/Components/Dropdown";

// IMage
import avatar1 from "assets/images/users/avatar-1.png";
import TotalFavorites from "pages/Components/Posts/TotalFavorites";
import TotalVideos from "pages/Components/Posts/TotalVideos";
import PostService from "services/PostService";
import { countryCodes } from "pages/Chat/countryCodes";
import { format, parseISO } from 'date-fns';
import authService from "services/authService";
import { ToastContainer, toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
    country_code: string;
    role: string;
    created_at?: string;
}

interface CurrentUser {
    user: User;
}
const AccountInfo = ({ className }: any) => {

 // Initialize state with undefined instead of null
 const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
 const [currentUser, setCurrentUser] = useState<any>(null); // Définition de currentUser dans le state
 useEffect(() => {
    const updateUser = () => {
        const storedUser = localStorage.getItem('user');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
            ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
            : undefined;
        setSelectedImage(profileImageUrl);
        setCurrentUser(currentUser);
    };

    updateUser();
    const intervalId = setInterval(updateUser, 10000); // Update every 10 seconds for testing

    return () => clearInterval(intervalId);
}, []);



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
        const intervalId = setInterval(fetchTotalPosts, 10000); // Update every 10 seconds for testing

        return () => clearInterval(intervalId);
    }, [currentUser]);
// country name 
const [Chat_Box_country_code, setChat_Box_country_code] = useState<any>();

const userChatOpen = (ele: any) => {
    setChat_Box_country_code(ele.country_code);
};

const [countryName, setCountryName] = useState<string>('Unknown');
const [currentUserCountryName, setCurrentUserCountryName] = useState<string>('Unknown');

useEffect(() => {
    if (Chat_Box_country_code) {
        console.log('country_code:', Chat_Box_country_code);
        const countryName = countryCodes[Chat_Box_country_code] || 'Unknown';
        console.log('countryName:', countryName);
        setCountryName(countryName);
    } else {
        setCountryName('Unknown');
    }
}, [Chat_Box_country_code]);

useEffect(() => {
    if (currentUser?.user?.country_code) {
        console.log('currentUser country_code:', currentUser.user.country_code);
        const name = countryCodes[currentUser.user.country_code] || 'Unknown';
        console.log('currentUserCountryName:', name);
        setCurrentUserCountryName(name);
    } else {
        setCurrentUserCountryName('Unknown');
    }
}, [currentUser]);

    return (
        <React.Fragment>
            <div className={className}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 2xl:grid-cols-12">
                    <div className="lg:col-span-2 2xl:col-span-1">
                        <div className="relative inline-block size-20 rounded-full shadow-md bg-slate-100 profile-user xl:size-28">
                        <img
                                src={selectedImage}
                                alt="Profile"
                                className="object-cover border-0 rounded-full img-thumbnail user-profile-image"
                                style={{ height: '100%', width: '100%' }}
                            />
                           
                        </div>
                    </div>
                    <div className="lg:col-span-10 2xl:col-span-9">
                    <div className="lg:col-span-10 2xl:col-span-9 text-slate-900 dark:text-gray-400">
    {currentUser && currentUser.user && currentUser.user.name
        ? <span>{currentUser.user.name} <BadgeCheck className="inline-block size-4 text-sky-500 fill-sky-100 dark:fill-sky-500/20 ml-2" /></span>
        : <span>undefined</span> 
    }
</div>

                        <div className="flex gap-3 mb-4">
                        <p className="text-slate-500 dark:text-zink-200">
    <UserCircle className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></UserCircle> 
    {currentUser && currentUser.user && currentUser.user.role
        ? <span>{currentUser.user.role} </span>
        : <span></span>
    }
    {currentUser && currentUser.user && currentUser.user.role && currentUser.user.service
        ? <span> at </span>
        : <span></span>
    }
    {currentUser && currentUser.user && currentUser.user.service
        ? <span>{currentUser.user.service} </span>
        : <span></span>
    }
</p>

                            <p className="text-slate-500 dark:text-zink-200"><MapPin className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></MapPin>{currentUserCountryName}</p>
                        </div>
                        <ul className="flex flex-wrap gap-3 mt-4 text-center divide-x divide-slate-200 dark:divide-zink-500 rtl:divide-x-reverse">
                        <div className="py-3 sm:py-0 sm:px-3">
                
                                <h6>{totalPosts}</h6>
                                <p className="text-slate-500 dark:text-zink-200">Posts</p>
                            </div>
                            <TotalFavorites />

                                <TotalVideos />
                        </ul>
                        {currentUser?.user?.email ? (
    <div className="flex gap-2 mt-4">
    <a  className="flex items-center justify-center transition-all duration-200 ease-linear rounded size-9 text-sky-500 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/20 dark:hover:bg-sky-500/30">
        <Mail className="size-4" />
    </a>
    <p className="ml-2 dark:text-gray-400">{currentUser.user.email}</p>
</div>

) : null}
 {currentUser?.user?.created_at ? (
                            <div className="flex gap-2 mt-4">
                                <a  className="flex items-center justify-center text-pink-500 transition-all duration-200 ease-linear bg-pink-100 rounded size-9 hover:bg-pink-200 dark:bg-pink-500/20 dark:hover:bg-pink-500/30">
                                    <Calendar className="size-4"></Calendar>
                                </a>
                                <p className="ml-2 dark:text-gray-400">Joining Date : {format(parseISO(currentUser.user.created_at), 'dd/MM/yyyy HH:mm:ss')}</p>
                            </div>
                        ) : null}
                    </div>
                    
                </div>
            </div>

        </React.Fragment>
    );
}

export default AccountInfo;