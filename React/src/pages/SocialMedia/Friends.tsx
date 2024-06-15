import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import { Link } from 'react-router-dom';
import { Dropdown } from 'Common/Components/Dropdown';
import TableContainer from 'Common/TableContainer';

// Icons
import { Plus, UserRoundX, BadgeCheck, Home, UserRound, CalendarDays, Clapperboard, ShoppingCart, Settings, ChevronDown, Search, LogOut, Mail, Bookmark, MoreHorizontal, GitPullRequest, MessagesSquare, HelpCircle, Heart, Send, FileEdit, Eye, Trash2, SlidersHorizontal, UserPlus } from 'lucide-react';

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
import figma from "assets/images/brand/figma.png";

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import {
    getSocialFriends as onGetSocialFriends
} from 'slices/thunk';
import LightDark from 'Common/LightDark';
import authService, { logout } from 'services/authService';
import PostService from 'services/PostService';
import filterDataBySearch from 'Common/filterDataBySearch';
import TotalFavorites from 'pages/Components/Posts/TotalFavorites';
import TotalVideos from 'pages/Components/Posts/TotalVideos';
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
const Friends = () => {
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

    const selectDataList = createSelector(
        (state: any) => state.Social,
        (state) => ({
            dataList: state.friendslist
        })
    );

    const { dataList } = useSelector(selectDataList);
 
    const [data, setData] = useState<any>([]);
    const [search, setSearch] = useState<string>("");

    // Get Data
    useEffect(() => {
        dispatch(onGetSocialFriends());
    }, [dispatch]);

    useEffect(() => {
        setData(dataList);
    }, [dataList]);

    const [type, setType] = useState<string>("Following");

    const btnFollow = useCallback((index: any) => {
        setData((prevDataArray: any) => {
            const updatedArray = [...prevDataArray];
            updatedArray[index] = {
                ...updatedArray[index],
                isFollow: !updatedArray[index].isFollow
            };
            return updatedArray;
        });
    }, []);

    const columns = useMemo(() => [
        {
            header: "Friend Name",
            accessorKey: "name",
            enableColumnFilter: false
        },
        {
            header: "Username",
            accessorKey: "username",
            enableColumnFilter: false,
            cell: (cell: any) => {
                return (
                    <Link to="#!" className="text-custom-500 username">{cell.getValue()}</Link>);
            }
        },
        {
            header: "Joining Date",
            accessorKey: "joiningDate",
            enableColumnFilter: false,
        },
        {
            header: "Status",
            accessorKey: "isFollow",
            enableColumnFilter: false,
            cell: (cell: any) => {
                return (
                    <button type="button" className={`bg-white border-dashed group/item toggle-button status text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20 px-2 py-1.5 text-xs ${cell.getValue() && "active"}`} onClick={() => btnFollow(cell.row.index)}>
                        <span className="group-[.active]/item:hidden block"><Plus className="inline-block size-3 mr-1" /> Follow</span>
                        <span className="group-[.active]/item:block hidden"><UserRoundX className="inline-block size-3 mr-1" /> Unfollow</span>
                    </button>);
            }
        }
    ], [btnFollow]
    );
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

    useEffect(() => {
        const fetchData = async () => {
          try {
            const users = await authService.getUsers();
            setData(users);
          } catch (error:any) {
            console.error('Error fetching users:', error.message);
          }
        };
    
        fetchData();
      }, []);
      
    // Search Data
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter((item: any) => 
            item.name.toLowerCase().includes(search.toLowerCase()) || 
            item.email.toLowerCase().includes(search.toLowerCase())|| 
            item.role.toLowerCase().includes(search.toLowerCase())|| 
            item.service.toLowerCase().includes(search.toLowerCase())

        );
    }, [search, data]);
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
                                <li className="group grow active">
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
                <div className="xl:col-span-9">

                <form action="#!" className="mb-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <div className="relative lg:col-span-4 xl:col-span-3">
                        <input 
                            type="text" 
                            className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                            placeholder="Search for name, email..." 
                            autoComplete="off" 
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                    </div>
                    
                </div>
            </form>

                <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 xl:grid-cols-4 last:mr-5">
                {(filteredData || []).filter((item: { id: any; }) => item.id !== currentUser.user.id).map((item: any, key: number) => (
                <div className="card" key={key}>
                    <div className="card-body">
                        <div className="relative flex items-center justify-center size-16 mx-auto text-lg rounded-full bg-slate-100 dark:bg-zink-600">
                            {item.profile_image ? <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="size-16 rounded-full" /> : (item.name.split(' ').map((word: any) => word.charAt(0)).join(''))}
                            {item.isActive ? <span className="absolute size-3 bg-green-400 border-2 border-white rounded-full dark:border-zink-700 bottom-1 ltr:right-1 rtl:left-1"></span> :
                                <span className="absolute size-3 bg-red-400 border-2 border-white rounded-full dark:border-zink-500 bottom-1 right-1"></span>}
                        </div>
                        <div className="flex items-center justify-center mt-2">
                            <Link
                                className="flex items-center justify-center text-slate-600 focus:text-slate-500 dark:text-zink-100 dark:focus:text-zink-200"
                                to="/pages-account"><Eye className="inline-block size-4" />
                            </Link>
                        </div>
                        <div className="mt-4 text-center">
                            <h5 className="mb-1 text-16 break-words"><Link to="/pages-account">{item.name}</Link></h5>
                            <p className="mb-3 text-slate-500 dark:text-zink-200 break-words">@{item.role} at {item.service} </p>
                            <p className="text-slate-500 dark:text-zink-200 break-words">{item.email}</p>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <Link to="/apps-chat" className="bg-white text-custom-500 btn border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:bg-zink-700 dark:hover:bg-custom-500 dark:ring-custom-400/20 dark:focus:bg-custom-500 grow"><MessagesSquare className="inline-block size-4 ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Send Message</span></Link>
                            {/* <button
                                type="button"
                                className="group/item toggle-button active px-2 py-2.5 text-xs bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20"onClick={(e) => btnFollow(e.target)}
                            >
                                <UserPlus className="size-4" />
                            </button> */}
                        </div>
                    </div>
                </div>))}
                </div>
                </div>
            </div>
              
        </React.Fragment>
    );
};

export default Friends;
