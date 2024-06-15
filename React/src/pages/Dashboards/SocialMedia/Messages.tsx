import React, { useEffect, useState } from "react";
import { Search } from 'lucide-react';

import { MessageData, PopularEventsData, UpcomingBirthdayData } from "Common/data";
import { Link } from "react-router-dom";
import filterDataBySearch from "Common/filterDataBySearch";
import authService from "services/authService";
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
const Messages = () => {

    const [data, setData] = useState(MessageData);
    const [users, setUsers] = useState([]);
    const [userList, setUserList] = useState([]);
    const [activeFriendsData, setActiveFriendsData] = useState<User[]>([]);
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
      // Function to handle search input and filter data
      const filterSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const keysToSearch = ['name'];
        filterDataBySearch(users, search, keysToSearch, setActiveFriendsData);
    };
// fetch users 

// Construct the profile image URL using the profile_image from currentUser.user
const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
  ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
  : undefined;
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
           <div className="col-span-12 lg:col-span-3 xl:col-span-3 2xl:block shrink-0 mr-1">
    <div className="card mb-4" id="messageList"> 
        <div className="card-body">
            <div className="flex items-center gap-3">
                <h6 className="mb-0 grow text-15">Messages</h6>
            </div>

            <div className="relative mt-3">
                <input 
                    type="text" 
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                    placeholder="Search for ..." 
                    autoComplete="off" 
                    onChange={(e) => filterSearchData(e)} 
                />
                <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
            </div>
            <div className="js-read-smore" data-read-smore-words="15">
                <ul className="flex flex-col gap-3 mt-5 list">
                    {(activeFriendsData || []).map((item: any, key: number) => (
                        <li key={key}>
                            <Link to={`#/apps-chat/${item.id}`} className="flex items-center gap-3 transition-all duration-150 ease-linear group/items">
                                <div className="relative rounded-full size-7 bg-slate-100 dark:bg-zink-600">
                                    <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="rounded-full h-7" />
                                    <span className={`absolute bottom-0 ltr:right-0 rtl:left-0 size-2.5 border-2 border-white dark:border-zink-700 rounded-full ${item.online ? 'bg-green-400' : 'bg-red-500'}`}></span>
                                </div>
                                <h6 className="transition-all duration-150 ease-linear group-hover/items:text-custom-500 user-name">{item.name}</h6>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>

    <div className="card" id="activeFriends">
        <div className="card-body">
            <h6 className="mb-4 text-15">Active Collaborators</h6>
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
    </div>
</div>

        </React.Fragment>
    );
};

export default Messages;