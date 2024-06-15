import React, { ChangeEvent, useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Calendar, Dribbble, Facebook, Github, Globe, ImagePlus, Instagram, Linkedin, Mail, MapPin, MoreHorizontal, UserCircle } from "lucide-react";
import { Dropdown } from "Common/Components/Dropdown";
import { format, parseISO } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

import avatar1 from "assets/images/users/avatar-1.png";
import PostService from "services/PostService";
import TotalFavorites from "pages/Components/Posts/TotalFavorites";
import TotalVideos from "pages/Components/Posts/TotalVideos";
import { countryCodes } from "pages/Chat/countryCodes";

interface User {
  id: number;
  name: string;
  email: string;
  country_code: string;
  phone: string;
  role: string;
  service: string;
  profile_image: string | null;
  online: boolean;
  created_at: string;
}

const AccountOverview = ({ className }: any) => {
    const location = useLocation();
    const state = location.state as { user: User } | undefined;
    const [user, setUser] = useState<User>(
        state?.user || {
            id: 0,
            name: '',
            email: '',
            country_code: '',
            phone: '',
            role: '',
            service: '',
            profile_image: null,
            online: false,
            created_at: '',
        }
    );

  const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>(avatar1);
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const imageUrl = user.profile_image ? `http://localhost:8000/storage/profile_images/${user.profile_image}` : undefined;
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        const userId = user ? user.id : null;
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
  }, [user]);
const navigate = useNavigate();
  return (
    <React.Fragment>
         <div className={className}>
        <button
    className="inline-flex items-center justify-center w-12 h-12 transition-all duration-200 ease-linear rounded-md cursor-pointer text-slate-500"
    onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
        
        </button>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 2xl:grid-cols-12">
          <div className="lg:col-span-2 2xl:col-span-1">
            <div className="relative inline-block size-20 rounded-full shadow-md bg-slate-100 profile-user xl:size-28 ml-24">
              <img src={imageUrl} alt="" className="object-cover border-0 rounded-full img-thumbnail user-profile-image ml-22" style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="lg:col-span-10 2xl:col-span-9">
            <h5 className="mb-1">{user.name} <BadgeCheck className="inline-block size-4 text-sky-500 fill-sky-100 dark:fill-custom-500/20"></BadgeCheck></h5>
            <div className="flex gap-3 mb-4">
              <p className="text-slate-500 dark:text-zink-200"><UserCircle className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></UserCircle> {user.role} at {user.service}</p>
            </div>
            <ul className="flex flex-wrap gap-3 mt-4 text-center divide-x divide-slate-200 dark:divide-zink-500 rtl:divide-x-reverse">
              <div className="py-3 sm:py-0 sm:px-3">
                <h6>{totalPosts}</h6>
                <p className="text-slate-500 dark:text-zink-200">Posts</p>
              </div>
              <TotalFavorites />
              <TotalVideos />
            </ul>
            {user.email && (
              <div className="flex gap-2 mt-4">
                <a className="flex items-center justify-center transition-all duration-200 ease-linear rounded size-9 text-sky-500 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/20 dark:hover:bg-sky-500/30">
                  <Mail className="size-4" />
                </a>
                <p className="ml-2 dark:text-gray-400">{user.email}</p>
              </div>
            )}
            {user.created_at && (
              <div className="flex gap-2 mt-4">
                <a className="flex items-center justify-center text-pink-500 transition-all duration-200 ease-linear bg-pink-100 rounded size-9 hover:bg-pink-200 dark:bg-pink-500/20 dark:hover:bg-pink-500/30">
                  <Calendar className="size-4"></Calendar>
                </a>
                <p className="ml-2 dark:text-gray-400">Joining Date: {format(parseISO(user.created_at), 'dd/MM/yyyy HH:mm:ss')}</p>
              </div>
            )}
            {user.country_code && (
              <div className="flex gap-2 mt-4">
                <a className="flex items-center justify-center text-gray-500 transition-all duration-200 ease-linear bg-gray-100 rounded size-9 hover:bg-gray-200 dark:bg-gray-500/20 dark:hover:bg-gray-500/30">
                  <MapPin className="size-4" />
                </a>
                <p className="ml-2 dark:text-gray-400">{countryCodes[user.country_code] || 'Unknown'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AccountOverview;
