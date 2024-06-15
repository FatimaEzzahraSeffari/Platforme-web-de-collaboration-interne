import React, { useCallback, useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
//images 
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
//icons 
import { BadgeCheck, Home, UserRound, CalendarDays, Clapperboard, ShoppingCart, Settings, Mail, Bookmark, LogOut, Plus, UserRoundX, GitPullRequest, MessagesSquare, HelpCircle, MoreHorizontal, Send,  } from 'lucide-react';
import LightDark from "Common/LightDark";
import { Link } from 'react-router-dom';

import {
    getEvents as onGetEvents,
    addEvents as onAddEvents,
    updateEvents as onUpdateEvents,
    deleteEvents as onDeleteEvents,
    getCategory as onGetCategory,
    deleteCategory as onDeleteCategory
} from 'slices/thunk';
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";
import { ToastContainer } from "react-toastify";
import authService, { logout } from "services/authService";
import PostService from "services/PostService";
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

  }
  interface UserProfileProps {
    users: User[];
  }
const DefaultCalendar = () => {

    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
        (state: any) => state.Calendar,
        (state) => ({
            dataList: state.event,
            category: state.category
        })
    );

    const { dataList, category } = useSelector(selectDataList);

    const [data, setData] = useState<any>([]);
    const [eventData, setEventData] = useState<any>();

    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // Get Data
    useEffect(() => {
        dispatch(onGetEvents());
        dispatch(onGetCategory());
    }, [dispatch]);

    useEffect(() => {
        const externalEvents: any = document.getElementById("external-events");
        new Draggable(externalEvents, {
            itemSelector: ".external-event",
        });
    }, []);

    useEffect(() => {
        setData(dataList);
    }, [dataList]);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const deleteToggle = () => setDeleteModal(!deleteModal);

    // Delete Data
    const onClickDelete = () => {
        setShow(false);
        setDeleteModal(true);
        if (eventData.id) {
            setEventData(eventData);
        }
    };

    const handleDelete = () => {
        if (eventData) {
            dispatch(onDeleteEvents(eventData.id));
            setDeleteModal(false);
        }
    };
    //

    // Update Data
    const handleEventClick = (ele: any) => {
        const event = ele.event;
        setEventData({
            id: event.id,
            title: event.title,
            start: event.start,
            className: event.classNames.join(" ")
        });
        setIsEdit(true);
        setShow(true);
    };

    // validation
    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            title: (eventData && eventData.title) || '',
            start: (eventData && eventData.start) || '',
            className: (eventData && eventData.className) || ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter title"),
            className: Yup.string().required("Please Enter category")
        }),

        onSubmit: (values) => {
            if (isEdit) {
                const updateData = {
                    id: eventData ? eventData.id : 0,
                    ...values,
                };
                // update user
                dispatch(onUpdateEvents(updateData));
            } else {
                const newData = {
                    ...values,
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    start: selectedDay ? selectedDay.date : new Date(),
                };
                // save new user
                dispatch(onAddEvents(newData));
            }
            toggle();
        },
    });

    // 
    const toggle = useCallback(() => {
        if (show) {
            setShow(false);
            setEventData("");
            setIsEdit(false);
        } else {
            setShow(true);
            setEventData("");
            validation.resetForm();
        }
    }, [show, validation]);

    const [selectedDay, setSelectedDay] = useState<any>(0);

    const handleDateClick = (arg: any) => {
        const date = arg["date"];
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const currectDate = new Date();
        const currentHour = currectDate.getHours();
        const currentMin = currectDate.getMinutes();
        const currentSec = currectDate.getSeconds();
        const modifiedDate = new Date(year, month, day, currentHour, currentMin, currentSec);
        const modifiedData = { ...arg, date: modifiedDate };

        setSelectedDay(modifiedData);
        toggle();
    };

    // On Drop
    const onDrop = (event: any) => {
        const date = event['date'];
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const currectDate = new Date();
        const currentHour = currectDate.getHours();
        const currentMin = currectDate.getMinutes();
        const currentSec = currectDate.getSeconds();
        const modifiedDate = new Date(year, month, day, currentHour, currentMin, currentSec);

        const draggedEl = event.draggedEl;
        const draggedElclass = draggedEl.className;
        const draggedElDataclass = draggedEl.getAttribute("data-class");

        if (toggledrop) {
            dispatch(onDeleteCategory(event.draggedEl.id));
        }

        if (draggedEl.classList.contains('external-event') && draggedElclass.indexOf("fc-event-draggable") === -1) {
            const modifiedData: any = {
                id: Math.floor(Math.random() * 100).toString(),
                title: draggedEl.innerText,
                start: modifiedDate,
                className: draggedElDataclass,
            };


            dispatch(onAddEvents(modifiedData));
        }
    };

    // Change Language
    const [lang, setLang] = useState<string>("en");
    const changeLanguage = (ele: any) => {
        const language = ele.target.value;
        setLang(language);
    };

    // Week Number
    const [toggleweek, setToggleweek] = useState<boolean>(false);
    const toggleWeekNumber = (ele: any) => {
        const checked = ele.target.checked;
        setToggleweek(checked);
    };

    // Business Hours
    const [togglebusinesshours, setToggleBusinessHours] = useState<boolean>(false);
    const toggleBusinessHours = (ele: any) => {
        const checked = ele.target.checked;
        setToggleBusinessHours(checked);
    };

    // Remove After Drop
    const [toggledrop, setToggleDrop] = useState<boolean>(false);
    const toggleDrop = (ele: any) => {
        const checked = ele.target.checked;
        setToggleDrop(checked);
    };
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    // Construct the profile image URL using the profile_image from currentUser.user
    const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
      ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
      : undefined;
    // Replace with your actual default image path
    const handleLogout = () => {
        logout(); // Appeler la fonction logout lors du clic sur le lien "Sign Out"
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
                                <li className="group grow active">
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
                                <li className="group grow ">
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
                    .filter((item: any) => item.online) 
                    .map((item: any, key: number) => (                                    <React.Fragment key={key}>
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
                        <div className="col-span-12 lg:col-span-7 xl:col-span-9 2xl:col-span-6 grid grid-cols-1 gap-x-5 xl:grid-cols-12">

                <div className="xl:col-span-9">
                    <div className="card">
                        <div className="card-body">
                            <div cursor-pointerid='calendar-container'>
                                <div id='calendar'>
                                    <FullCalendar
                                        plugins={[
                                            dayGridPlugin,
                                            interactionPlugin,
                                            listPlugin
                                        ]}
                                        initialView="dayGridMonth"
                                        themeSystem="tailwindcss"
                                        slotDuration={"00:15:00"}
                                        handleWindowResize={true}
                                        weekends={true}
                                        editable={true}
                                        droppable={true}
                                        selectable={true}
                                        weekNumbers={toggleweek}
                                        businessHours={togglebusinesshours}
                                        locale={lang}
                                        events={data}
                                        headerToolbar={{
                                            left: 'prev,next,today',
                                            center: "title",
                                            right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                                        }}
                                        dateClick={handleDateClick}
                                        eventClick={handleEventClick}
                                        drop={onDrop}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-3">
                    <div className="card mr-1">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">Draggable Events</h6>
                            <div id='external-events' className="flex flex-col gap-3 mb-4">
                                {(category || []).map((item: any, key: number) => (
                                    <button id={item.id} data-class={item.dataClass} className={item.className} key={key}>
                                        {item.title}
                                    </button>
                                ))}
                                <div>
                                    <label htmlFor="locale-select" className="inline-block mb-2 text-base font-medium">Locale:</label>
                                    <select id="locale-select" className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" onChange={(e) => changeLanguage(e)}>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="it">Italiana</option>
                                        <option value="ru">русский</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id='drop-remove' className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800" type="checkbox" onChange={(e) => toggleDrop(e)} checked={toggledrop} />
                                    <label htmlFor="drop-remove" className="align-middle cursor-pointer">
                                        Remove after drop
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id='businessCalendar' className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800" type="checkbox" onChange={(e) => toggleBusinessHours(e)} checked={togglebusinesshours} />
                                    <label htmlFor="businessCalendar" className="align-middle cursor-pointer">
                                        Business Hours & Week
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input id='weekNumberCalendar' className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800" type="checkbox" onChange={(e) => toggleWeekNumber(e)} checked={toggleweek} />
                                    <label htmlFor="weekNumberCalendar" className="align-middle cursor-pointer">
                                        Week Number
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

</div>  
    <Modal show={show} onHide={toggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? "Edit Event" : "Add Event"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form className="needs-validation" name="event-form" id="form-event" onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                            <div className="xl:col-span-12">
                                <label htmlFor="event-title" className="inline-block mb-2 text-base font-medium">Event Name</label>
                                <input type="text" id="event-title" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Event name"
                                    name="title"
                                    onChange={validation.handleChange}
                                    value={validation.values.title || ""}
                                />
                                {validation.touched.title && validation.errors.title ? (
                                    <p className="text-red-400">{validation.errors.title}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="event-category" className="inline-block mb-2 text-base font-medium">Category</label>
                                <select required className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="event-category"
                                    name="className"
                                    onChange={validation.handleChange}
                                    value={validation.values.className || ""}
                                >
                                    <option>Select Category</option>
                                    <option value="border-none rounded-md py-1.5 px-3 w-[100%] transition-all text-custom-500 !bg-custom-100 dark:!bg-custom-500/20">Primary</option>
                                    <option value="border-none rounded-md py-1.5 px-3 w-[100%] text-green-500 !bg-green-100 dark:!bg-green-500/20">Success</option>
                                    <option value="border-none rounded-md py-1.5 px-3 w-[100%] text-sky-500 !bg-sky-100 dark:!bg-sky-500/20">Info</option>
                                    <option value="border-none rounded-md py-1.5 px-3 w-[100%] text-yellow-500 !bg-yellow-100 dark:!bg-yellow-500/20">Warning</option>
                                    <option value="border-none rounded-md py-1.5 px-3 w-[100%] text-purple-500 !bg-purple-100 dark:!bg-purple-500/20">Purple</option>
                                </select>
                                {validation.touched.className && validation.errors.className ? (
                                    <p className="text-red-400">{validation.errors.className}</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" onClick={toggle}>Cancel</button>
                            {!!isEdit && <button type="reset" id="btn-delete-event" className="text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20" onClick={onClickDelete}>Delete</button>}
                            <button type="submit" id="btn-save-event" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">{!!isEdit ? "Update" : "Add Event"}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
           

        </React.Fragment>
    );
};

export default DefaultCalendar;