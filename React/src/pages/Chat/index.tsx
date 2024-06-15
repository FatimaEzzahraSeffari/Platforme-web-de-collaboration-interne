import React, { useEffect, useRef, useState } from 'react';

// Images
import logoSm from "assets/images/logo-sm.png";
import avatar1 from "assets/images/users/avatar-1.png";
import avatar5 from "assets/images/users/avatar-5.png";
import user2 from "assets/images/users/user-2.jpg";
import img2 from "assets/images/small/img-2.jpg";
import OCPLink from "assets/images/OCPLINK.png";
import OCPDARK1 from "assets/images/OCPDARK1.png";
import userDummayImage from "assets/images/users/user-dummy-img.jpg";
import SimpleBar from 'simplebar-react';
import { FaBackward } from 'react-icons/fa';

// Icons
import { MessagesSquare, SquareUser, Bot, UserRound, ScrollText, Settings, ChevronsLeft, Search, Plus, X, MoreVertical, Phone, MapPin, Mail, BellRing, Video, PanelRightOpen, Mic, Image, Send, PhoneCall, ImagePlus, Star, LogOut, Bell, Globe, ArrowLeft, Paperclip, Play, Pause, Trash2, Trash, DownloadCloudIcon, TrashIcon } from 'lucide-react';
import Tab from 'Common/Components/Tab/Tab';
import { Nav } from 'Common/Components/Tab/Nav';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'Common/Components/Dropdown';
import { ContactList, RecentChats, RecentFind, Documents } from "Common/data";

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import Drawer from 'Common/Components/Drawer';
import Modal from 'Common/Components/Modal';
import PrismCode from 'Common/Components/Prism';
import Header from 'Layout/Header';
import LightDark from 'Common/LightDark';
import authService, { logout } from 'services/authService';
import { PreviousIcon } from 'yet-another-react-lightbox/*';
import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { countryCodes } from './countryCodes';

import io from 'socket.io-client';
import { deleteMessage, editMessage, fetchMessages, replyToMessage, sendApiMessage } from 'services/apiService';
import { onMessageReceived, sendMessage } from 'services/socketService';
import { FaFilePdf, FaFileImage, FaFileAlt, FaFileWord, FaFilePowerpoint, FaFileExcel, FaFileVideo } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import { ToastContainer, toast } from 'react-toastify';
import DeleteModal from './DeleteModal';
import EditMessageForm from './Editmessage';
import { type } from 'os';
import Reactionservice from 'services/Reactionservice';
import EmojiPicker from 'emoji-picker-react';
import DeleteModalConversation from "Common/DeleteModal";

const socket = io('http://localhost:4000');
countries.registerLocale(enLocale);

interface User {
    id: number;
    roomId: number;
    name: string;
    profile_image?: string;
    role?: string;
    country_code?: string;
    phone: string;
    email?: string;
    countryCode: string; 
    online: boolean;

}
export interface MessageData {
    content: string;
}

export interface Message extends MessageData {
    id: number;
    type: string;
    file?: File;
    isSender?: boolean;
    receiverId: number;
    file_path?: string;
    senderProfileImage?: string;
    file_url?: string | string[];
    bookmark?: boolean;
    replyTo?: Message;
    content: string;
    created_at: string;



}
interface ContactItem {
    id: number;
    roomId: number;
    name: string;
    profile_image?: string;
    role?: string;
    country_code?: string;
    phone?: string;
    email?: string;
    countryCode?: string;
    online: boolean;

}
interface RecentChatItem {
    id: number;
    roomId: number;
    name: string;
    profile_image?: string;
    role?: string;
    country_code?: string;
    phone?: string;
    email?: string;
    countryCode?: string;
    content: string; 
    timestamp?: string; 
    file_path?: string;
    type: string;
    online: boolean;


}

interface UserProfileProps {
    users: User[];
}
interface FileDescription {
    [key: string]: string;
}


const Chat: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [contactlist, setContactlist] = useState<ContactItem[]>([]);
    const [curMessage, setCurMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [inputType, setInputType] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedMediaFiles, setSelectedMediaFiles] = useState<File[]>([]);
    const [selectedDocumentFiles, setSelectedDocumentFiles] = useState<File[]>([])
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isMicModalOpen, setIsMicModalOpen] = useState<boolean>(false);
    const [currentUserCountryName, setCurrentUserCountryName] = useState<string>('Unknown');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [fileDescriptions, setFileDescriptions] = useState<FileDescription>({});
    const [selectedMessageId, setSelectedMessageId] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const messageRefs = useRef({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditMessage, setSelectedEditMessage] = useState<Message | null>(null);
    const [messageList, setMessageList] = useState(messages);
    const [deleteType, setDeleteType] = useState<'me' | 'everyone'>('me');
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [allContacts, setAllContacts] = useState<User[]>([]);
    const [allRecentChats, setAllRecentChats] = useState<RecentChatItem[]>([]);
    const [recentChatslist, setRecentChatslist] = useState<RecentChatItem[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [isDialogConversationOpen, setIsDialogConversationOpen] = useState(false);
    function formatTimeAgo(messageCreatedAt: string | number | Date | undefined) {
        if (messageCreatedAt) { 
          const date = new Date(messageCreatedAt);
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
          return "Date inconnue";
        }
      }
      
    const handleDeleteConversation = async () => {
        if (selectedConversationId === null) {
            console.error('Receiver ID is not set');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/conversations/${receiverId}`);
            // Après suppression, mettez à jour l'état des messages
            setMessages([]);
            toast.success('Conversation deleted successfully');
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            toast.error('Failed to delete conversation');
        }
    };
    const openDeleteModalConversation = (conversationId: number) => {
        setSelectedConversationId(conversationId);
        setIsDialogConversationOpen(true);
    };

    const handleClose = () => {
        setIsDialogConversationOpen(false);
        setSelectedConversationId(null);
    };

    const handleDelete = () => {
        handleDeleteConversation();
        handleClose();
    };
    //edit message
    const handleEditClick = (message: Message) => {
        setSelectedEditMessage(message);
        setIsEditModalOpen(true);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedEditMessage(null);
    };

    const handleSave = async (messageData: MessageData) => {
        if (selectedEditMessage) {
            try {
                const updatedMessage = await editMessage(selectedEditMessage.id, messageData);
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === selectedEditMessage.id ? { ...msg, content: messageData.content } : msg
                    )
                );
                toast.success('Message updated successfully');
                handleModalClose();
            } catch (error) {
                console.error("Failed to update message:", error);
                toast.error("Failed to update message");
            }
        }
    };
    //fetch la liste totale de tous les documents de differents composants 
    const [filteredDocumentMessages, setFilteredDocumentMessages] = useState<any[]>([]);
    const [filteredDocumentMessages1, setFilteredDocumentMessages1] = useState<any[]>([]);

    const [allDocumentMessages, setAllDocumentMessages] = useState<any[]>([]);
    const fetchDocumentMessages = async () => {
        try {
            const fetchedMessages = await fetchMessages();

            const documentMessages1 = fetchedMessages.filter((msg: any) => msg.type === 'media' || msg.type === 'document');
            //  setMessages(fetchedMessages);
            setAllDocumentMessages(documentMessages1);
            setFilteredDocumentMessages1(documentMessages1);

        } catch (error) {
            console.error('Error fetching document messages:', error);
        }
    };
    useEffect(() => {
        fetchDocumentMessages();
        const intervalId = setInterval(fetchDocumentMessages, 5000);
        // Rafraîchit toutes les 5 secondes

        return () => clearInterval(intervalId);


    }, []);
    //fetch document pour chaque conversation
    const fetchDocumentMessage = async () => {
        try {
            const fetchedMessages = await fetchMessages();

            // Filter messages for the specific conversation based on receiverId
            const filteredMessages = fetchedMessages.filter((msg: any) =>
                msg.receiver_id === receiverId || msg.user_id === receiverId
            );

            // Fetch documents
            const documentMessages = filteredMessages.filter((msg: Message) => msg.type === 'media' || msg.type === 'document');

            // Sort by date
            documentMessages.sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // Take the three latest documents
            const latestDocumentMessages = documentMessages.slice(0, 3);
            setFilteredDocumentMessages(latestDocumentMessages);
        } catch (error) {
            console.error('Error fetching document messages:', error);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, [receiverId]);

    useEffect(() => {
        fetchDocumentMessage();
        const intervalId = setInterval(fetchDocumentMessage, 5000); // Refresh documents every 5 seconds

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [receiverId]);
    //fetch msg 
    const fetchChatMessages = async () => {
        try {

            const fetchedMessages = await fetchMessages();

            // Filter messages for the specific conversation based on receiverId
            const filteredMessages = fetchedMessages.filter((msg: any) =>
                msg.receiver_id === receiverId || msg.user_id === receiverId
            );
            setMessages(filteredMessages);

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, [receiverId]);
    // Recharger les messages lorsque receiverId change

    //destroy message 
    const handleDeleteForEveryone = async () => {
        try {
            await deleteMessage(selectedMessageId, 'everyone');
            fetchChatMessages(); // Refresh the messages after deletion
            fetchDocumentMessages(); // Refresh the documents after deletion
            fetchDocumentMessage(); // Refresh the documents after deletion
            toast.success('Message deleted for everyone');
            closeDeleteModal();
        } catch (error: any) {
            console.error('Error deleting message for everyone:', error);
            toast.error('Error deleting message for everyone: ' + error.response?.data?.error || error.message);
            closeDeleteModal();

        }
    };

    const handleDeleteForMe = async () => {
        try {
            await deleteMessage(selectedMessageId, 'me');
            fetchChatMessages(); // Refresh the messages after deletion
            toast.success('Message deleted for you');
            closeDeleteModal();
        } catch (error: any) {
            console.error('Error deleting message for me:', error);
            toast.error('Error deleting message for me: ' + error.response?.data?.error || error.message);
            closeDeleteModal();

        }
    };

    const openDeleteModal = (messageId: string, type: 'me' | 'everyone') => {
        setSelectedMessageId(messageId);
        setDeleteType(type);
        setIsDialogOpen(true);
    };




    const closeDeleteModal = () => {
        setIsDialogOpen(false);
        setSelectedMessageId("");
    };

    const handleEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
        setCurMessage(curMessage + emojiObject.emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    useEffect(() => {
        onMessageReceived((message: any) => {
            console.log('Message received from server:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
            setFileType(type);
        }
    };

    const handleAddMore = (type: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'media' ? 'image/*,video/*' : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const filesArray = Array.from(target.files);
                setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
                setFileType(type);
            }
        };
        input.click();
    };

    const handleSendMessage = async (type: string) => {
        if (receiverId === null) {
            console.error('Receiver ID is not set');
            return;
        }

        if (type === 'text' && curMessage.trim() !== '') {
            try {
                if (replyingTo) {
                    console.log('Sending reply message:', curMessage);
                    const newMessage = replyToMessage(replyingTo.id, curMessage, replyingTo.id, currentUserId, receiverId, 'text');
                    sendMessage(newMessage);
                    setReplyingTo(null); // Réinitialiser l'état de réponse après l'envoi
                } else {
                    console.log('Sending text message:', curMessage);
                    const messageData = await sendApiMessage(curMessage, 'text', receiverId);
                    sendMessage(messageData);
                }
                fetchChatMessages(); // Rafraîchir les messages après l'envoi
                setCurMessage('');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        } else if ((type === 'media' || type === 'document') && selectedFiles.length > 0) {
            const promises = selectedFiles.map((file) => {
                const description = fileDescriptions[file.name] || '';
                return sendApiMessage(description, fileType || type, receiverId, file);
            });
            try {
                const messagesData = await Promise.all(promises);
                messagesData.forEach((messageData) => sendMessage(messageData));
                fetchChatMessages(); // Rafraîchir les messages après l'envoi
                setSelectedFiles([]);
                setFileType(null);
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error sending file messages:', error);
            }
        } else if (type === 'audio' && audioBlob) {
            const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            const messageData = await sendApiMessage('', 'audio', receiverId, audioFile);
            sendMessage(messageData);
            fetchChatMessages(); // Rafraîchir les messages après l'envoi
            setAudioBlob(null);
            setIsRecording(false);
            setIsPaused(false);
            setRecordingTime(0);
            setIsMicModalOpen(false);
        }
    };
    const handleReplyClick = (msg: Message) => {
        setReplyingTo(msg);
    };
    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedDescriptions = { ...fileDescriptions };
        delete updatedDescriptions[selectedFiles[index].name];
        setSelectedFiles(updatedFiles);
        setFileDescriptions(updatedDescriptions);
    };

    const handleDescriptionChange = (e: any, fileName: string) => {
        setFileDescriptions({ ...fileDescriptions, [fileName]: e.target.value });
    };
    const formatFileSize = (size: number) => {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    };



    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioBlob(event.data);
                    const url = URL.createObjectURL(event.data);
                    if (wavesurferRef.current) {
                        wavesurferRef.current.load(url);
                    }
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);

            intervalRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            intervalRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsMicModalOpen(false);
    };

    const openMicModal = () => {
        setIsMicModalOpen(true);
        startRecording();
    };

    const closeMicModal = () => {
        setIsMicModalOpen(false);
        deleteRecording();
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };


    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage />;
            case 'doc':
            case 'docx':
                return <FaFileWord />;
            case 'ppt':
            case 'pptx':
                return <FaFilePowerpoint />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel />;
            case 'mp4':
                return <FaFileVideo />;
            default:
                return <FaFileAlt />;
        }
    };
    const fileExtensionClass = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'text-red-500';
            case 'doc':
            case 'docx':
                return 'text-blue-700';
            case 'ppt':
            case 'pptx':
                return 'text-orange-500';
            case 'xls':
            case 'xlsx':
                return 'text-green-500';
            case 'mp4':
                return 'text-purple-500';
                return 'text-red-500';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    const openModal = (type: string) => {
        setInputType(type);
        setIsModalOpen(true);
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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Function to toggle dropdown visibility
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const [Chat_Box_Username, setChat_Box_Username] = useState<any>();
    const [Chat_Box_Image, setChat_Box_Image] = useState<any>();
    const [Chat_Box_Role, setChat_Box_Role] = useState<any>();
    const [Chat_Box_Email, setChat_Box_Email] = useState<any>();
    const [Chat_Box_Phone, setChat_Box_Phone] = useState<any>();
    const [Chat_Box_country_code, setChat_Box_country_code] = useState<any>();

    const [currentRoomId, setCurrentRoomId] = useState<any>(1);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleToggleDrawer = () => setIsOpen(!isOpen);

    const [show, setShow] = useState<boolean>(false);
    const toggleCallModal = () => setShow(!show);

    const [contact, setContact] = useState<boolean>(false);
    const toggleContactModal = () => setContact(!contact);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleUserClick = (user: User) => {
        console.log('handleUserClick:', user);
        setSelectedUser(user);
        setChat_Box_Username(user.name);
        setChat_Box_Image(user.profile_image ? `http://localhost:8000/storage/profile_images/${user.profile_image}` : userDummayImage);
        setChat_Box_Role(user.role);
        setChat_Box_country_code(user.country_code);
        setChat_Box_Phone(user.phone);
        setChat_Box_Email(user.email);
        setReceiverId(user.id); // Mettre à jour receiverId avec l'identifiant de la nouvelle conversation

    };

    const profileImageUrl1 = selectedUser && selectedUser.profile_image
        ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(selectedUser.profile_image)}`
        : userDummayImage;
    // Content
    const handlechatbotList = (name: any) => {
        const chartlist = document.getElementById('chartlist');
        const botlist = document.getElementById('botlist');
        if (name === 'bot') {
            chartlist?.classList.remove('active');
            botlist?.classList.add('active');
        } else {
            botlist?.classList.remove('active');
            chartlist?.classList.add('active');
        }
    };

    // Responsive


    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
        (state: any) => state.Chat,
        (state) => ({
            dataList: state.chats
        })
    );

    const { dataList } = useSelector(selectDataList);





    //Use For Chat Box
    const userChatOpen = (ele: any) => {
        console.log('userChatOpen:', ele);
        setChat_Box_Username(ele.name);
        setChat_Box_Image(ele.profile_image ? `http://localhost:8000/storage/profile_images/${ele.profile_image}` : userDummayImage);
        setChat_Box_Role(ele.role);
        setChat_Box_country_code(ele.country_code);
        setChat_Box_Phone(ele.phone);
        setChat_Box_Email(ele.email);
        setCurrentRoomId(ele.roomId);

        // Set receiverId dynamically
        setReceiverId(ele.id);
        document.querySelector(".menu-content")?.classList.add("hidden");
        document.querySelector(".chat-content")?.classList.add("show");
    };

    // Retun To Contact
    const retunToContact = () => {
        document.querySelector(".menu-content")?.classList.remove("hidden");
        document.querySelector(".chat-content")?.classList.remove("show");
    };

    // Copy Message
    const handleCopyClick = (msg: string) => {
        if (msg) {
            navigator.clipboard.writeText(msg)
                .then(() => {
                    const copyClipboardElement = document.getElementById("copyClipBoard");
                    if (copyClipboardElement) {
                        copyClipboardElement.classList.remove("hidden");
                        setTimeout(() => {
                            copyClipboardElement.classList.add("hidden");
                        }, 1000);
                    }
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });
        }
    };


    // Recent Chats

    const filterRecentChatsData = (e: any) => {
        const search = e.target.value.toLowerCase();
        const keysToSearch = ['name', 'role'];
        const filteredData = allRecentChats.filter((item: any) => {
            return keysToSearch.some((key: any) => {
                const value = item[key];
                return value && value.toLowerCase().includes(search);
            });
        });

        setRecentChatslist(filteredData);
    };





    // Recent Find
    const [recentFindlist, setRecentFindlist] = useState<any>(RecentFind);
    const filterRecentFindData = (e: any) => {
        const search = e.target.value;
        const keysToSearch = ['topic'];
        const filteredData = RecentFind.filter((item: any) => {
            const searchMatch = !search || keysToSearch.some((key: any) => item[key].toLowerCase().includes(search.toLowerCase()));
            return searchMatch;
        });

        setRecentFindlist(filteredData);
    };

    // Documents

    const filterDocumentslistData = (e: any) => {
        const search = e.target.value.toLowerCase();
        const keysToSearch = ['file_path'];
        const filteredData = allDocumentMessages.filter((msg: any) => {
            return keysToSearch.some((key: any) => {
                const value = msg[key];
                return value && value.toLowerCase().includes(search);
            });
        });

        setFilteredDocumentMessages1(filteredData);
    };

    const navigate = useNavigate(); // Correct hook for navigation

    const returnToPreviousPage = () => {
        navigate(-1); // Navigates back to the previous page
    };
    //friends list 
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await authService.getUsers();
                const fetchedMessages = await fetchMessages();

                // Filter messages for the specific conversation based on receiverId
                const filteredMessages = fetchedMessages.filter((msg: any) =>
                    msg.receiver_id === receiverId || msg.user_id === receiverId
                );
                setMessages(filteredMessages);
                // Filter out the current user
                const filteredUsers = fetchedUsers.filter((user: User) => user.id !== currentUser.user.id);
                setUsers(filteredUsers);
                setAllContacts(filteredUsers);
                setContactlist(filteredUsers); // Initialize contact list with filtered users
              
            } catch (error: any) {
                console.error('Error fetching users:', error.message);
            }
        };
        // Fetch users only after messages have been loaded
        if (messages.length > 0) {
            fetchUsers();
        }

        fetchUsers();
        
    }, [currentUser.user.id]);
//fetch recent chat 
useEffect(() => {
    const fetchRecentchat = async () => {
        try {
            const fetchedUsers = await authService.getUsers();
            const fetchedMessages = await fetchMessages();

            const filteredUsers = fetchedUsers.filter((user: User) => user.id !== currentUser.user.id);

            // Filter recent chats where the current user has exchanged messages
            const userChats = filteredUsers.map((user:User) => {
                const userMessages = fetchedMessages.filter((msg: any) => msg.user_id === user.id || msg.receiver_id === user.id);
                const lastMessage = userMessages.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
//afficher le dernier msg dans la conversation avec time 
return {
    ...user,
    content: lastMessage ? lastMessage.content : '',
    file_path: lastMessage ? lastMessage.file_path : '',
    type: lastMessage ? lastMessage.type : '',
    timestamp: lastMessage ? lastMessage.created_at : '',
    online: user.online, // Add online status here
};
            }).filter((chat: { content: string; file_path: string; }) => chat.content !== '' || chat.file_path !== '');

            setAllRecentChats(userChats);
            setRecentChatslist(userChats);
        } catch (error:any) {
            console.error('Error fetching users:', error.message);
        }
    };

    fetchRecentchat(); // Fetch users immediately

    const intervalId = setInterval(fetchRecentchat, 5000); // Update users every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
}, [currentUser.user.id]);

    const filterContactData = (e: any) => {
        const search = e.target.value.toLowerCase();
        const keysToSearch = ['name', 'designation', 'role', 'email', 'phone', 'country_code'];
        const filteredData = allContacts.filter((item: any) => {
            return keysToSearch.some((key: any) => {
                const value = item[key];
                return value && value.toLowerCase().includes(search);
            });
        });

        setContactlist(filteredData);
    };


    //add msg 
    const [data, setData] = useState<any[]>([]);
    const chatRef = useRef(null);




    const [countryName, setCountryName] = useState<string>('Unknown');

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
    document.title = `Chat | OCPLINK Collaboration platform`;
    // Remplacer avec l'ID réel de l'utilisateur connecté

    const currentUserId = currentUser?.user?.id || 0;
    const filteredMessages = messages.filter(msg => !msg.deleted_for || !msg.deleted_for.includes(currentUserId));
    //  reactions

    const [showReactions, setShowReactions] = useState<{ [key: string]: boolean }>({});
    const [reactions, setReactions] = useState<{ [messageId: number]: { [emoji: string]: number } }>({});
    const [showEmojiPicker1, setShowEmojiPicker1] = useState(false);
    const [selectedMsgId, setSelectedMsgId] = useState<number | null>(null);

    const handleAddReaction = async (messageId: number, emoji: string) => {
        try {
            await Reactionservice.addOrUpdateReaction(messageId, emoji, receiverId!);
            fetchChatMessages(); // Refresh messages to include new reactions
        } catch (error) {
            console.error('Failed to add reaction:', error);
        }
    };


    const toggleReactions = (id: string) => {
        setShowReactions(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    const fetchReactionsForMessage = async (messageId: number) => {
        try {
            const fetchedReactions = await Reactionservice.fetchReactions(messageId);
            setReactions(prevReactions => ({
                ...prevReactions,
                [messageId]: fetchedReactions.reduce((acc: { [key: string]: number }, reaction: { emoji: string, count: number }) => {
                    acc[reaction.emoji] = reaction.count;
                    return acc;
                }, {}),
            }));
        } catch (error) {
            console.error('Failed to load reactions:', error);
        }
    };

    useEffect(() => {
        messages.forEach(msg => {
            fetchReactionsForMessage(msg.id);
        });
    }, [messages]);

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        if (selectedMsgId !== null) {
            handleAddReaction(selectedMsgId, emojiObject.emoji);
            setShowEmojiPicker1(false);
        }
    };

    const handleEmojiPickerClick = (messageId: number) => {
        setSelectedMsgId(messageId);
        setShowEmojiPicker1(!showEmojiPicker1);
    };

    const clearReply = () => {
        setReplyingTo(null);
    };
    // Function to handle opening document in a new window
    const openDocument = (url: string) => {
        window.open(url, '_blank');
    };
    return (

        <React.Fragment>


            <div className=" container-fluid group-data-[content=boxed]:max-w-boxed mx-auto relative  ">
                <div className="flex gap-5 mt-1 ">
                    <Tab.Container defaultActiveKey='mainChatList'>
                        <div className="fixed inset-x-0 bottom-12 2xl:w-20  shrink-0 xl:relative z-[20] text-center xl:bottom-auto">
                            <div className="xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] inline-block card xl:h-[calc(100%_-_theme('spacing.5'))] shadow-lg xl:shadow-md">
                                <div className="flex items-center h-full p-2 2xl:p-4 xl:flex-col">
                                    <Link to="#!" className="hidden xl:block">
                                        <img src={OCPLink} alt="" className="h-8 mx-auto" />
                                    </Link>
                                    <Nav className="flex gap-2 my-auto text-center xl:pt-8 xl:flex-col nav-tabs">
                                        <Nav.Item eventKey='mainChatList' className="group/item tabs chatTab">
                                            <Link to="#!" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md mainChatList">
                                                <MessagesSquare className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" onClick={() => { handlechatbotList("chat"); retunToContact(); }} />
                                            </Link>
                                        </Nav.Item>
                                        <Nav.Item eventKey='contactList' className="group/item tabs">
                                            <Link to="#!" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md">
                                                <SquareUser className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" onClick={() => { handlechatbotList("contactList"); retunToContact(); }} />
                                            </Link>
                                        </Nav.Item>
                                        <Nav.Item eventKey='botChat' className="group/item botTab">
                                            <Link to="#!" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md botChat">
                                                <Bot className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" onClick={() => { handlechatbotList("bot"); retunToContact(); }} />
                                            </Link>
                                        </Nav.Item>
                                        <Nav.Item eventKey='profile' className="group/item tabs">
                                            <Link to="#!" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md">
                                                <UserRound className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" onClick={retunToContact} />
                                            </Link>
                                        </Nav.Item>
                                        <Nav.Item eventKey='fileDocument' className="group/item tabs">
                                            <Link to="#!" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md">
                                                <ScrollText className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" onClick={retunToContact} />
                                            </Link>
                                        </Nav.Item>


                                    </Nav>
                                    <ul className="flex items-center gap-2 my-auto text-center xl:mb-0 xl:mt-auto xl:pt-4 xl:flex-col ">
                                        <li >
                                            <Link to="/pages-account-settings" className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md group/item"><Settings className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" /></Link>
                                        </li>
                                        <li>
                                            <button
                                                className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md group/item cursor-pointer"
                                                onClick={returnToPreviousPage}
                                            >
                                                <ChevronsLeft
                                                    className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover:item:text-custom-500 dark:group-hover:item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500"
                                                />
                                            </button>
                                        </li>
                                        <div className="d-block mt-5" >
                                            <Nav.Item eventKey='lightdark' className="group/item tabs ">
                                                <LightDark />
                                            </Nav.Item>
                                        </div>
                                        <div className="relative inline-flex items-center">
                                            <button onClick={toggleDropdown} type="button" className="transition-all duration-200 ease-linear bg-pink-100 rounded-md dark:bg-pink-500/20">
                                                <img src={profileImageUrl} alt="Current User" className="size-12 rounded-md" />
                                            </button>


                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="block w-full xl:block xl:w-80 shrink-0 menu-content">
                            <div className="height: 'calc(100vh - 4rem)' xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] card xl:h-[calc(100%_-_theme('spacing.5'))]">
                                <div className="flex flex-col h-full">
                                    <Tab.Content className="tab-content">
                                        <Tab.Pane eventKey='mainChatList' className="tab-pane" id="mainChatList">
                                            <div className="card-body">
                                                <div className="flex items-center gap-3">
                                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"><ChevronsLeft className="size-4 mx-auto" /></button>
                                                    <h6 className="text-15 grow">Chats</h6>
                                                </div>
                                                <div className="relative mt-5">
                                                    <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Search for ..." autoComplete="off" onChange={filterRecentChatsData} />
                                                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                                </div>
                                            </div>
                                            <SimpleBar className="h-[calc(100vh_-_20px)] xl:h-[calc(100vh_-_180px)]">

                                                <ul className="flex flex-col gap-1" id="chatList">

                                                    <li className="px-5">
                                                        <p className="mb-1 text-slate-500 dark:text-zink-200">Recent Chats</p>
                                                    </li>
                                                    {recentChatslist.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {key === 3 && (
                                                                <li className="px-5">
                                                                    <p className="mb-1 text-slate-500 dark:text-zink-200">All Conversation</p>
                                                                </li>
                                                            )}

                                                            <li>
                                                                <Link
                                                                    to="#!"
                                                                    className={`flex items-center gap-1 px-5 py-2 [&.active]:bg-slate-50 dark:[&.active]:bg-zink-600 group/item ${Chat_Box_Username === item.name && "active"}`}
                                                                    onClick={() => userChatOpen(item)}
                                                                >
                                                                    <div className="relative flex items-center justify-center font-semibold rounded-full text-slate-500 dark:text-zink-200 size-9 bg-slate-100 dark:bg-zink-600">
                                                                        {item.profile_image ? (
                                                                            <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="rounded-full h-9" />
                                                                        ) : (
                                                                            item.name.split(' ').map((word: string) => word.charAt(0)).join('')
                                                                        )}
                        <span className={`absolute bottom-0 ltr:right-0 rtl:left-0 size-2.5 border-2 border-white dark:border-zink-700 rounded-full ${item.online ? 'bg-green-400' : 'bg-red-500'}`}></span>
                                                                    </div>
                                                                  <div className="overflow-hidden grow">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-xs truncate text-slate-500 dark:text-zink-200">
                        {item.type === 'text' ? item.content : item.file_path}
                    </p>
                </div>
                {item.timestamp && (
                    <div className="self-start shrink-0 text-slate-500 dark:text-zink-200">
                <small>{formatTimeAgo(item.timestamp)}</small>
                    </div>
                )}                                            
                                                                    <Dropdown className="relative dropdown shrink-0">
                                                                        <Dropdown.Trigger type="button" className="dropdown-toggle" id={`contactListDropdown${item.id}`} data-bs-toggle="dropdown"><MoreVertical className="inline-block size-4 mr-1" /></Dropdown.Trigger>

                                                                        <Dropdown.Content className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="contactListDropdown1">

                                                                            <li>
                                                                                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#! " onClick={() => openDeleteModalConversation(item.id)}><TrashIcon className="inline-block size-3 mr-1" /><span className="align-middle">Delete</span></Link>
                                                                            </li>
                                                                        </Dropdown.Content>
                                                                    </Dropdown>
                                                                </Link>

                                                            </li>
                                                        </React.Fragment>
                                                    ))}
                                                    {!recentChatslist.length && (
                                                        <li className="px-5">
                                                            <p className="mb-1 text-slate-500 dark:text-zink-200">No Conversation Found</p>
                                                        </li>
                                                    )}
                                                </ul>

                                            </SimpleBar>
                                            <DeleteModalConversation show={isDialogConversationOpen} onHide={handleClose} onDelete={handleDelete} />

                                        </Tab.Pane>
                                        <Tab.Pane eventKey='contactList' className="tab-pane" id="contactList">
                                            <div className="card-body">
                                                <div className="flex items-center gap-3">
                                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"><ChevronsLeft className="size-4 mx-auto" /></button>
                                                    <h6 className="text-15 grow">Collaborators</h6>
                                                </div>
                                                <div className="relative mt-5">
                                                    <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Search for ..." autoComplete="off" onChange={(e: any) => filterContactData(e)} />
                                                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                                </div>
                                            </div>
                                            <SimpleBar className="max-h-[calc(100vh_-_390px)] xl:max-h-[calc(100vh_-_150px)]">
                                                <ul className="flex flex-col gap-1">
                                                    <li className="px-5">
                                                        <p className="mb-1 text-slate-500 dark:text-zink-200">Collaborators List</p>
                                                    </li>

                                                    {(contactlist || []).map((item, key) => (<li key={key}>                                                        <div className={`flex items-center gap-3 px-5 py-2 [&.active]:bg-slate-50 group/item dark:[&.active]:bg-zink-600 offline ${Chat_Box_Username === item.name && "active"}`} onClick={() => userChatOpen(item)}>
                                                        <div className="relative flex items-center justify-center font-semibold rounded-full text-slate-500 dark:text-zink-200 size-9 bg-slate-100 dark:bg-zink-600">
                                                            {item.profile_image ? <img src={`http://localhost:8000/storage/profile_images/${item.profile_image}`} alt="" className="rounded-full h-9" /> : (item.name.split(' ').map((word: any) => word.charAt(0)).join(''))}

                                                            <span className={`absolute bottom-0 ltr:right-0 rtl:left-0 size-2.5 border-2 border-white dark:border-zink-700 rounded-full ${item.online ? 'bg-green-400' : 'bg-red-500'}`}></span>
                                                        </div>
                                                        <Link to="#!" className="overflow-hidden grow">
                                                            <h6 className="mb-1">{item.name}</h6>
                                                            <p className="text-xs truncate text-slate-500 dark:text-zink-200">{item.role}</p>
                                                        </Link>

                                                    </div>
                                                    </li>))}

                                                    {!contactlist.length && <li className="px-5">
                                                        <p className="mb-1 text-slate-500 dark:text-zink-200">No Collaborator Found</p>
                                                    </li>}

                                                </ul>
                                            </SimpleBar>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='botChat' className="tab-pane" id="botChat">
                                            <div className="card-body">
                                                <div className="flex items-center gap-3">
                                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"><ChevronsLeft className="size-4 mx-auto" /></button>
                                                    <h6 className="text-15 grow">AI Bot</h6>
                                                </div>
                                                <div className="relative mt-5">
                                                    <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Search for ..." autoComplete="off" onChange={(e) => filterRecentFindData(e)} />
                                                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                                </div>
                                            </div>
                                            <p className="mx-5 mb-2 text-slate-500 dark:text-zink-200">Recent Find</p>
                                            <SimpleBar className="max-h-[calc(100vh_-_410px)] xl:max-h-[calc(100vh_-_90px)]">
                                                <ul className="flex flex-col gap-1">
                                                    {(recentFindlist || []).map((item: any, key: number) => (<li key={key}>
                                                        <Link to="#!" className="flex items-center gap-3 px-5 py-2.5 [&.active]:bg-slate-50 dark:[&.active]:bg-zink-600 active">
                                                            <div className="relative flex items-center justify-center font-semibold rounded-full text-slate-500 size-7 dark:text-zink-200 shrink-0">
                                                                <MessagesSquare className="size-4" />
                                                            </div>
                                                            <h6 className="font-medium truncate grow">{item.topic}</h6>
                                                        </Link>
                                                    </li>))}

                                                    {!recentFindlist.length && <li className="px-5">
                                                        <p className="mb-1 text-slate-500 dark:text-zink-200">No Data Found</p>
                                                    </li>}
                                                </ul>
                                            </SimpleBar>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='profile' className="tab-pane" id="profile">
                                            <SimpleBar className="max-h-[calc(100vh_-_410px)] xl:max-h-[calc(100vh_-_50px)] card-body">

                                                <div className="flex items-center gap-3">
                                                    <h6 className="text-15 grow">Profile</h6>

                                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 hover:text-red-500 dark:bg-zink-600 dark:text-zink-200 dark:hover:text-red-500"><X className="size-4 mx-auto " /></button>
                                                </div>
                                                <div className="text-center">
                                                    <div className="size-20 mx-auto mt-8 bg-pink-100 rounded-full dark:bg-pink-500/20">
                                                        <img src={profileImageUrl} alt="Current User" className="h-20 rounded-full" />
                                                    </div>
                                                    <h5 className=" text-16 h-4 mb-4 dark:text-zink-200">{currentUser.user.name}</h5>
                                                    <p className="text-slate-500 dark:text-zink-200 ">{currentUser.user.role}</p>
                                                </div>

                                                <div className="mt-5">
                                                    <p className="mb-4 text-slate-500 dark:text-zink-200">Personal Information</p>
                                                    <h6 className="mb-3 font-medium"><Phone className="inline-block size-4 mr-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{`${currentUser.user.country_code} ${currentUser.user.phone}`}</span></h6>
                                                    <h6 className="mb-3 font-medium"><MapPin className="inline-block size-4 mr-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{currentUserCountryName}</span></h6>
                                                    <h6 className="font-medium"><Mail className="inline-block size-4 mr-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{currentUser.user.email}</span></h6>
                                                </div>

                                            </SimpleBar>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='fileDocument' className="tab-pane" id="fileDocument">
                                            <div className="card-body">
                                                <div className="flex items-center gap-3">
                                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"><ChevronsLeft className="size-4 mx-auto" /></button>
                                                    <h6 className="text-15 grow">Documents</h6>
                                                </div>
                                                <div className="relative mt-5">
                                                    <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Search for ..." autoComplete="off" onChange={(e) => filterDocumentslistData(e)} />
                                                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                                </div>
                                            </div>
                                            <SimpleBar className="h-[calc(100vh_-_20px)] xl:h-[calc(100vh_-_180px)]">
                                                <div className="flex flex-col gap-3">
                                                    {filteredDocumentMessages1.map((msg, key) => (

                                                        <Link to="#!" className="flex items-center gap-3 !py-3 border-y border-dashed rounded-md card-body border-slate-200 dark:border-zink-500" key={key} onClick={() => openDocument(msg.file_url)}>
                                                            <div className="flex items-center justify-center text-sm font-semibold rounded-md size-9 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 shrink-0">
                                                                {msg.senderProfileImage ? <img src={`http://localhost:8000/storage/profile_images/${msg.senderProfileImage}`} alt="" className="object-cover rounded-md h-9" /> : msg.type.toUpperCase()}
                                                            </div>

                                                            <div className="grow">
                                                                <h6>{msg.file_path || msg.type.toUpperCase()}</h6>
                                                            </div>
                                                        </Link>
                                                    ))}

                                                    {!filteredDocumentMessages1.length && (
                                                        <Link to="#!" className="flex items-center gap-3 !py-3 border-y border-dashed rounded-md card-body border-slate-200 dark:border-zink-500">
                                                            <p className="mb-1 text-slate-500 dark:text-zink-200">No Data Found</p>
                                                        </Link>
                                                    )}
                                                </div>
                                            </SimpleBar>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </div>
                    </Tab.Container>
                    <div id='chartlist' className={`height: 'calc(100vh - 4rem)' xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] card w-full hidden [&.show]:block [&.active]:xl:block chat-content active`}>
                        <div className="px-4 py-3 text-sm unreadConversations-alert text-yellow-500 border border-transparent rounded-md bg-yellow-50 dark:bg-yellow-400/20 hidden" id="copyClipBoard">
                            <span className="font-bold">Message Copied</span>
                        </div>
                        <div className="relative flex flex-col h-full">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500" onClick={retunToContact}><ChevronsLeft className="size-4 mx-auto" /></button>
                                    <Link to="#!" data-drawer-target="drawerEnd" className="flex items-center gap-3 ltr:mr-auto rtl:ml-auto shrink-0" id="userChatProfile">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-zink-600">
                                            {Chat_Box_Image === undefined ? (
                                                <img src={profileImageUrl1} className="h-10 rounded-full" alt="" />
                                            ) : (
                                                <img src={Chat_Box_Image} className="h-10 rounded-full" alt="" />
                                            )}
                                        </div>
                                        <div>
                                            <h6> {Chat_Box_Username}</h6>
                                            <p className="text-sm text-slate-500 dark:text-zink-200">{Chat_Box_Role}</p>
                                        </div>
                                    </Link>
                                    <ul className="flex items-center">
                                        <li>
                                            <Link to="#!" className="inline-flex items-center justify-center size-10 transition-all duration-200 ease-linear rounded-md group/item" onClick={toggleCallModal}><Phone className="mx-auto transition-all size-4 duration-200 ease-linear fill-slate-100 text-slate-500 dark:fill-zink-600 dark:text-zink-200 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" /></Link>
                                        </li>
                                        <li>
                                            <Link to="#!" className="inline-flex items-center justify-center size-10 transition-all duration-200 ease-linear rounded-md group/item"><Video className="mx-auto transition-all size-4 duration-200 ease-linear fill-slate-100 text-slate-500 dark:fill-zink-600 dark:text-zink-200 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500" /></Link>
                                        </li>

                                        <li className="hidden md:block">
                                            <Link to="#!" data-drawer-target="drawerEnd" className="inline-flex items-center justify-center size-10 transition-all duration-200 ease-linear rounded-md group/item" onClick={handleToggleDrawer}>
                                                <PanelRightOpen className="size-4 mx-auto transition-all duration-200 ease-linear fill-slate-100 dark:fill-zink-600 dark:text-zink-200 text-slate-500 group-hover/item:text-custom-500 group-hover/item:fill-custom-100 dark:group-hover/item:fill-custom-500/20 dark:group-hover/item:text-custom-500 group-[.active]/item:hidden block" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="relative bg-slate-50 dark:bg-zink-600/50 grow">
                                <div className="absolute inset-x-0 top-0 z-10 hidden transition-all duration-200 ease-linear bg-white border-y border-slate-200 dark:bg-zink-700 dark:border-zink-500" id="searchChat">
                                    <input type="text" className="w-full px-5 py-2 focus:outline-none" placeholder="Search for ..." autoComplete="off" />
                                </div>
                                <SimpleBar ref={chatRef} className="h-[calc(100vh_-_410px)] xl:h-[calc(100vh_-_200px)]">
                                    <ul className="flex flex-col gap-5 list-none card-body">
                                        {filteredMessages.map((msg, index) => (
                                            <li key={index} className={`flex chat-message group/item ${msg.isSender ? 'justify-end' : ''}`}>
                                                <div className="flex gap-3">
                                                    <Link to="#!" className="flex items-center self-end justify-center text-sm font-semibold rounded-full size-9 bg-slate-100 text-slate-500 dark:bg-zink-300 dark:text-zink-200 shrink-0">
                                                        <img src={msg.isSender ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}` : msg.senderProfileImage ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(msg.senderProfileImage)}` : userDummayImage} alt="" className="object-cover rounded-full h-9" />
                                                    </Link>
                                                    <div className="grow flex flex-col gap-3">
                                                        <div className="flex gap-3">





                                                            <div className={`relative p-4 rounded-md shadow-sm 2xl:max-w-sm ${msg.isSender ? 'bg-blue-100 dark:bg-gray-500' : 'bg-white dark:bg-zink-500 dark:text-zink-100 '}`}>
                                                                {msg.bookmark && <Star className="block size-2" />}
                                                                {msg.type === 'text' && <p>{msg.content}</p>}
                                                                {msg.type === 'audio' && (
                                                                    /\.(webm|aiff|au|mid|midi|m4a|wav|wma)$/i.test(msg.file_url) ? (
                                                                        <>
                                                                            {console.log(`audio URL: ${msg.file_url}`)}
                                                                            <audio controls className="max-w-fl h-autoul">
                                                                                <source src={msg.file_url} type={`audio/mp3`} />
                                                                                Your browser does not support the audio tag.
                                                                            </audio>
                                                                        </>
                                                                    ) : null
                                                                )}

                                                                {
                                                                    msg.type === 'media' && msg.file_url && (
                                                                        Array.isArray(msg.file_url) ? (
                                                                            <div className={msg.file_url.length > 1 ? 'media-grid my-4 grid grid-cols-2 gap-4' : 'my-4'}>
                                                                                {msg.file_url.map((url: any, index: any) => (
                                                                                    <div key={index} className="my-4">
                                                                                        {msg.content && (
                                                                                            <p className="mb-2">{msg.content}</p>
                                                                                        )}
                                                                                        {/\.(jpeg|jpg|gif|png)$/i.test(url) ? (
                                                                                            <img src={url} alt="Media" className="object-cover w-full h-48 rounded-lg" />
                                                                                        ) : /\.(mp4|mov|avi)$/i.test(url) ? (
                                                                                            <video controls className="object-cover w-full h-48 rounded-lg">
                                                                                                <source src={url} type={`video/${url.split('.').pop()}`} />
                                                                                                Your browser does not support the video tag.
                                                                                            </video>
                                                                                        ) : null}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="my-4">
                                                                                {msg.content && (
                                                                                    <p className="mb-2">{msg.content}</p>
                                                                                )}
                                                                                {/\.(jpeg|jpg|gif|png)$/i.test(msg.file_url) ? (
                                                                                    <img src={msg.file_url} alt="Media" className="object-cover w-full h-48 rounded-lg" />
                                                                                ) : /\.(mp4|mov|avi)$/i.test(msg.file_url) ? (
                                                                                    <video controls className="object-cover w-full h-48 rounded-lg">
                                                                                        <source src={msg.file_url} type={`video/${msg.file_url.split('.').pop()}`} />
                                                                                        Your browser does not support the video tag.
                                                                                    </video>
                                                                                ) : null}
                                                                            </div>
                                                                        )
                                                                    )
                                                                }

                                                                {msg.type === 'document' && (
                                                                    <div className="my-4">
                                                                        {msg.content && (
                                                                            <p className="mb-2">{msg.content}</p>
                                                                        )}

                                                                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center">
                                                                            <DownloadCloudIcon className="mr-2" />
                                                                            <span>Download Document</span></a>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Show reactions */}
                                                            {reactions[msg.id] && (
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {Object.entries(reactions[msg.id]).map(([emoji, count]) => (
                                                                        <div key={emoji} className="flex items-center">
                                                                            <span>{emoji}</span>
                                                                            <span className="ml-1 text-sm text-gray-500">{count}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <Dropdown className="relative transition-all duration-200 ease-linear opacity-0 dropdown shrink-0 group-hover/item:opacity-100">
                                                                <Dropdown.Trigger type="button" className="dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown">
                                                                    <MoreVertical className="inline-block size-4 ml-1" />
                                                                </Dropdown.Trigger>
                                                                <Dropdown.Content className="absolute z-50 py-2 mt-1 list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="dropdownMenuButton">
                                                                    <li>
                                                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!" onClick={() => handleReplyClick(msg)}>Reply</Link>
                                                                    </li>
                                                                    <li>
                                                                        {msg.isSender && msg.type === 'text' && (
                                                                            <li>
                                                                                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!" onClick={() => handleEditClick(msg)}>Edit</Link>
                                                                            </li>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!" onClick={() => handleCopyClick(msg.content)}>Copy</Link>
                                                                    </li>



                                                                    <li>
                                                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!" onClick={() => openDeleteModal(msg.id, msg.isSender ? 'everyone' : 'me')}>Delete</Link>

                                                                    </li>
                                                                    <li >
                                                                        <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!" onClick={() => toggleReactions(msg.id)}>😊</Link>
                                                                        {showReactions[msg.id] && (
                                                                            <div className={`absolute bottom-10 ${msg.isSender ? 'right-0' : 'left-0'} z-50 flex items-center p-2 bg-white border rounded shadow-lg dark:bg-slate-700 dark:border-zinc-500`}>
                                                                                {['👍', '❤️', '😂', '😮', '😢', '👏', '👎'].map((emoji) => (
                                                                                    <button
                                                                                        key={emoji}
                                                                                        type="button"
                                                                                        className="p-1 text-xl hover:bg-gray-200 dark:bg-slate-700 dark:border-zinc-500"
                                                                                        onClick={() => handleAddReaction(msg.id, emoji)}
                                                                                    >
                                                                                        {emoji}
                                                                                    </button>
                                                                                ))}
                                                                                <button
                                                                                    type="button"
                                                                                    className="p-1 text-xl hover:bg-gray-200"
                                                                                    onClick={() => handleEmojiPickerClick(msg.id)}
                                                                                >
                                                                                    ➕
                                                                                </button>
                                                                                {showEmojiPicker1 && selectedMsgId === msg.id && (
                                                                                    <div className={`absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg ${msg.isSender ? 'right-0' : 'left-0'} z-50 flex items-center p-2 bg-white border rounded shadow-lg dark:bg-slate-700 dark:border-zinc-500`}>

                                                                                        {/* <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg"> */}
                                                                                        <EmojiPicker onEmojiClick={onEmojiClick} className="dark:bg-slate-700 dark:border-zinc-500" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />



                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        </div>
                                                    </div>

                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <EditMessageForm
                                        isOpen={isEditModalOpen}
                                        message1={selectedEditMessage}
                                        onClose={handleModalClose}
                                        onSave={handleSave}
                                    />
                                    {isDialogOpen && (
                                        <DeleteModal
                                            show={isDialogOpen}
                                            onHide={closeDeleteModal}
                                            onDeleteForMe={handleDeleteForMe}
                                            onDeleteForEveryone={handleDeleteForEveryone}
                                            modalPosition={modalPosition}
                                            deleteType={deleteType as 'me' | 'everyone'} // Ensure the type matches
                                        />

                                    )}
                                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                                </SimpleBar>

                            </div>
                            <div className="card-body">
                                <div className="flex items-center gap-2">
                                    <div className="grow">
                                        {replyingTo && (
                                            <div className="relative mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    Replying to {replyingTo.content}
                                                </span>
                                                <button onClick={clearReply} className="absolute top-0 right-0 mt-1 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="relative flex items-center">
                                            <button type="button" className="p-2" onClick={toggleEmojiPicker}>
                                                😊
                                            </button>
                                            {showEmojiPicker && (
                                                <div className="absolute bottom-10 left-0 z-10">
                                                    <Picker onEmojiClick={handleEmojiClick} />
                                                </div>
                                            )}

                                            <input
                                                type="text"
                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                placeholder="Type your message here ..."
                                                value={curMessage}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('text')}
                                                onChange={(e) => setCurMessage(e.target.value)}
                                            />
                                        </div> </div>
                                    <div className="flex -gap-1">
                                        <button
                                            type="button"
                                            onClick={openMicModal}

                                            className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-slate-500 btn bg-transparent border-transparent hover:text-slate-700 focus:text-slate-700 active:text-slate-700 dark:text-zink-200 dark:hover:text-zink-50 dark:focus:text-zink-50 dark:active:text-zink-50"
                                        > <Mic className="size-4" />

                                        </button>


                                        <button type="button" onClick={() => openModal('document')} className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-slate-500 btn bg-transparent border-transparent hover:text-slate-700 focus:text-slate-700 active:text-slate-700 dark:text-zink-200 dark:hover:text-zink-50 dark:focus:text-zink-50 dark:active:text-zink-50"><Paperclip className="size-4" />

                                        </button>

                                        <button type="button" onClick={() => openModal('media')}


                                            className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-slate-500 btn bg-transparent border-transparent hover:text-slate-700 focus:text-slate-700 active:text-slate-700 dark:text-zink-200 dark:hover:text-zink-50 dark:focus:text-zink-50 dark:active:text-zink-50"><Image className="size-4" />

                                        </button>



                                        <button type="button" onClick={() => handleSendMessage('text')} className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"><Send className="inline-block size-4 mr-1 align-middle" /> <span className="align-middle">Send</span></button>

                                    </div>
                                </div>

                            </div>
                            {isMicModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
                                    <div className="bg-white p-4 rounded-lg shadow-lg w-80 dark:bg-slate-700 dark:border-zinc-500">
                                        <div className="flex items-center  mb-4 justify-end">
                                            <button onClick={closeMicModal} className="text-gray-500 hover:text-gray-700  mr-4">
                                                &times;
                                            </button>

                                        </div>
                                        <div className="flex justify-center items-center ">
                                            <span className="text-3xl -mt-8 dark:text-white">{formatTime(recordingTime)}</span>
                                        </div>

                                        <div className="  flex items-center justify-center mb-4">
                                            <button onClick={deleteRecording} className="absolute -ml-64 text-red-500 hover:text-red-700 ">
                                                <Trash className="size-4" />
                                            </button>
                                            {isPaused ? (
                                                <button onClick={resumeRecording} className="text-green-500 hover:text-green-700 mx-4">
                                                    <Play className="size-4" />
                                                </button>
                                            ) : (
                                                <button onClick={pauseRecording} className="text-yellow-500 hover:text-yellow-700 mx-4">
                                                    <Pause className="size-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    stopRecording();
                                                    handleSendMessage('audio');
                                                }}
                                                className="absolute  -mr-60 flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600"
                                            >
                                                <Send className="size-4" />
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )}
                            {isModalOpen && (
                                <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                    <div className="modal-content bg-white p-6 rounded-md shadow-lg relative w-96 dark:bg-slate-700 dark:border-zinc-500">
                                        <span
                                            className="close absolute top-2 right-2 text-gray-500 cursor-pointer"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            &times;
                                        </span>
                                        <h2 className="text-lg font-semibold mb-4">Files to upload</h2>
                                        {selectedFiles.length > 0 && (
                                            <ul className="space-y-2 mb-4">
                                                {selectedFiles.map((file, index) => (
                                                    <li key={index} className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
                                                        <div className="flex items-center flex-1 truncate">
                                                            <span className={`w-5 h-5 mr-2 ${fileExtensionClass(file.name)}`}>{getFileIcon(file.name)}</span>
                                                            <span className="mr-2 flex-1">{file.name}</span>
                                                            <span className="text-gray-500 text-sm text-right w-20">{formatFileSize(file.size)}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Add description"
                                                            className="ml-2 p-1 border rounded-md flex-1"
                                                            value={fileDescriptions[file.name] || ''}
                                                            onChange={(e) => handleDescriptionChange(e, file.name)}
                                                        />
                                                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 ml-2">
                                                            <Trash className="size-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <label
                                            htmlFor="fileInput"
                                            className="text-blue-500 cursor-pointer mb-4 inline-block"
                                        >
                                            + Add file
                                        </label>
                                        {inputType && (
                                            <>
                                                <input
                                                    type="file"
                                                    accept={inputType === 'media' ? "image/*,video/*" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"}
                                                    onChange={(e) => handleFileChange(e, inputType)}
                                                    className="mb-4 hidden"
                                                    id="fileInput"
                                                />

                                            </>
                                        )}

                                        <div className="flex justify-between mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="text-blue-500 bg-white dark:text-white hover:bg-blue-100 hover:text-blue-700 border border-blue-500 rounded px-4 py-2 dark:bg-slate-700 dark:hover-bg-blue-400"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (selectedFiles.length > 0) {
                                                        handleSendMessage(inputType || 'media');
                                                    } else {
                                                        alert('Please select a file before sending.');
                                                    }
                                                }}
                                                className="text-white btn bg-blue-500 hover:bg-blue-700"
                                            >
                                                Upload {selectedFiles.length} {selectedFiles.length > 1 ? 'files' : 'file'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}          </div>
                    </div>

                    <div id='botlist' className={`height: 'calc(100vh - 4rem)' xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] card w-full hidden [&.show]:block [&.active]:xl:block bot-content`}>
                        <div className="relative">
                            <SimpleBar className="h-[calc(100vh_-_20px)] xl:h-[calc(100vh_-_90px)]">
                                <div className="sticky top-0 flex items-center gap-3 shadow-sm bg-white/60 dark:bg-zink-700/30 backdrop-blur-sm card-body">
                                    <div className="relative flex items-center justify-center size-8 font-semibold rounded-full text-slate-500 bg-slate-100 dark:text-zink-200 dark:bg-zink-600">
                                        <img src={user2} alt="" className="h-8 rounded-full" />
                                    </div>
                                    <h6>What is Tailwind CSS, and what is Utility-First CSS?</h6>
                                </div>
                                <div className="flex gap-3 card-body bg-slate-50 dark:bg-zink-600">
                                    <div className="flex items-center justify-center size-8 font-semibold rounded-full text-slate-500 bg-slate-100 shrink-0 dark:text-zink-200 dark:bg-zink-600">
                                        <Bot className="size-5" />
                                    </div>
                                    <div className="grow">
                                        <p className="mb-2">Tailwind CSS is a <b>utility-first</b> CSS framework designed for rapid UI development. Instead of providing pre-built components, it offers low-level utility classes that let you build custom designs without ever leaving your HTML.</p>
                                        <p className="mb-0">Utility-first CSS is an approach where you use small, single-purpose classes to build your user interface. These utility classes are composed to create complex designs directly in the HTML, rather than relying on custom CSS. This approach favors composition over inheritance, making it easier to maintain and scale your codebase.</p>
                                    </div>
                                </div>
                                <div className="sticky top-0 flex items-center gap-3 shadow-sm bg-white/60 backdrop-blur-sm card-body dark:bg-zink-700/30">
                                    <div className="relative flex items-center justify-center size-8 font-semibold rounded-full text-slate-500 bg-slate-100">
                                        <img src={user2} alt="" className="h-8 rounded-full" />
                                    </div>
                                    <h6>How to install and set up Tailwind CSS in a project?</h6>
                                </div>
                                <div className="flex gap-3 card-body bg-slate-50 dark:bg-zink-600">
                                    <div className="flex items-center justify-center size-8 font-semibold rounded-full text-slate-500 bg-slate-100 shrink-0 dark:text-zink-200 dark:bg-zink-600">
                                        <Bot className="size-5" />
                                    </div>
                                    <div className="grow">
                                        <p className="mb-2">To install Tailwind CSS, you can use npm or yarn by running the following commands:</p>
                                        <p className="mb-2">Using npm:</p>
                                        <PrismCode code={`npm install tailwindcss`} language={("js")} plugins={["line-numbers"]} />
                                        <p className="mt-4 mb-2">Using yarn:</p>
                                        <PrismCode code={`yarn add tailwindcss`} language={("js")} plugins={["line-numbers"]} />
                                        <p className="mt-4 mb-2">After installing, create a configuration file called <code className="text-xs text-pink-500 select-all">tailwind.config.js</code> in your project's root directory using the following command:</p>
                                        <PrismCode code={`npx tailwindcss init`} language={("js")} plugins={["line-numbers"]} />
                                        <p className="mt-4 mb-2">In your project's CSS file, import Tailwind's base styles, components, and utilities using the <code className="text-xs text-pink-500 select-all">@import</code> directive:</p>
                                        <PrismCode code={`@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';`} language={("js")} plugins={["line-numbers"]} />
                                    </div>
                                </div>
                            </SimpleBar>
                            <div className="card-body">
                                <div className="flex items-center gap-2">
                                    <div className="grow">
                                        <input type="text" id="inputText" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Type your message here ..." required autoComplete="off" />
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button type="button" className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-slate-500 btn bg-transparent border-transparent hover:text-slate-700 focus:text-slate-700 active:text-slate-700 dark:text-zink-200 dark:hover:text-zink-50 dark:focus:text-zink-50 dark:active:text-zink-50"><Mic className="size-4" /></button>
                                        <button type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"><Send className="inline-block size-4 mr-1 align-middle" /> <span className="align-middle">Send</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Profile Drawer */}
            <Drawer show={isOpen} onHide={handleToggleDrawer} id="drawerEnd" drawer-end="true" className="fixed inset-y-0 flex flex-col w-full transition-transform duration-300 ease-in-out transform bg-white shadow ltr:right-0 rtl:left-0 md:w-80 z-drawer dark:bg-zink-600">
                <div className="h-full p-4 overflow-y-auto">
                    <div>
                        <div className="flex items-center gap-3">
                            <button id="closeChatRightSidebar" className="inline-flex items-center justify-center h-8 transition-all duration-200 ease-linear rounded-md shrink-0 text-slate-500 hover:text-custom-500"><ChevronsLeft className="size-4 mx-auto" /></button>
                            <h6 className="text-15 grow">Profile</h6>
                            <Drawer.Header data-drawer-close="drawerEnd" className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 hover:text-red-500 dark:bg-zink-600 dark:text-zink-200 dark:hover:text-red-500">
                                <X className="size-4 mx-auto"></X></Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <div className="text-center">
                                <div className="size-20 mx-auto mt-8 rounded-full bg-slate-100 dark:bg-zink-600">
                                    <img src={Chat_Box_Image} alt="" className="h-20 rounded-full" />
                                </div>
                                <h5 className="mt-4 text-16">{Chat_Box_Username}</h5>
                                <p className="text-slate-500 dark:text-zink-200">{Chat_Box_Role}</p>
                            </div>
                            <div className="mt-5">
                                <p className="mb-4 text-slate-500 dark:text-zink-200">Personal Information</p>
                                <h6 className="mb-3 font-medium"><Phone className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{`${Chat_Box_country_code} ${Chat_Box_Phone}`}</span></h6>
                                <h6 className="mb-3 font-medium"><MapPin className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{countryName}</span></h6>
                                <h6 className="font-medium"><Mail className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" /> <span className="align-middle">{Chat_Box_Email}</span></h6>
                            </div>
                            <div className="mt-5">

                                <div className="mt-5">
                                    <p className="mb-4 text-slate-500 dark:text-zink-200">Recent Shares</p>

                                    <div>
                                        <div className="flex flex-col gap-3">
                                            {filteredDocumentMessages.map((msg, key) => (
                                                <Link
                                                    to="#!"
                                                    className="flex items-center gap-3 p-2 border border-dashed rounded-md border-slate-200 dark:border-zink-500"
                                                    key={key}
                                                    onClick={() => openDocument(msg.file_url)}
                                                >
                                                    <div className="flex items-center justify-center text-sm font-semibold rounded-md size-9 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 shrink-0">
                                                        {msg.senderProfileImage ? (
                                                            <img src={`http://localhost:8000/storage/profile_images/${msg.senderProfileImage}`} alt="" className="object-cover rounded-md h-9" />
                                                        ) : (
                                                            msg.type.toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="grow">
                                                        <h6>{msg.file_path || msg.type.toUpperCase()}</h6>
                                                        <p className="text-slate-500 dark:text-zink-200">{msg.size ? `${(msg.size / 1024).toFixed(2)} KB` : ''}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            {!filteredDocumentMessages.length && (
                                                <Link to="#!" className="flex items-center gap-3 p-2 border border-dashed rounded-md border-slate-200 dark:border-zink-500">
                                                    <p className="mb-1 text-slate-500 dark:text-zink-200">No Data Found</p>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Drawer.Body>
                    </div>
                </div>
            </Drawer>

            {/* Contact Modal */}
            <Modal show={contact} onHide={toggleContactModal} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">Add Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto p-4">
                    <form action="#!">
                        <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                            <img src={profileImageUrl1} alt="" className="object-cover w-full h-full rounded-full user-profile-image" />
                            <div className="absolute bottom-0 right-0 flex items-center justify-center size-8 rounded-full profile-photo-edit">
                                <input id="profile-img-file-input" type="file" className="hidden profile-img-file-input" required />
                                <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                    <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                </label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contactnameInput" className="inline-block mb-2 text-base font-medium">Friend Name</label>
                            <input type="text" id="contactnameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter Name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="destinationInput" className="inline-block mb-2 text-base font-medium">Destination</label>
                            <input type="text" id="destinationInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Destination" required />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" data-modal-close="addContactModal" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" onClick={toggleContactModal}>Cancel</button>
                            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20" onClick={toggleContactModal}>Add Friend</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>



            {/* Call Modal */}
            <Modal show={show} onHide={toggleCallModal} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-8">
                    <div className="text-center">
                        <div className="size-20 mx-auto rounded-full bg-slate-100 dark:bg-zink-500">
                            <img src={Chat_Box_Image} alt="" className="h-20 rounded-full" />
                        </div>
                        <h5 className="mt-4 mb-1 text-16">{Chat_Box_Username}</h5>
                        <p className="text-green-500">Calling...</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <Link to="#!" className="flex items-center justify-center size-12 p-0 text-white bg-green-500 border-green-500 rounded-full btn hover:text-white hover:bg-green-600 hover:border-green-600 focus:text-white focus:bg-green-600 focus:border-green-600 focus:ring focus:ring-green-100 active:text-white active:bg-green-600 active:border-green-600 active:ring active:ring-green-100 dark:ring-green-400/10"><PhoneCall /></Link>
                        <Link to="#!" className="flex items-center justify-center size-12 text-white bg-red-500 border-red-500 rounded-full btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-red-400/20" onClick={toggleCallModal}><Phone /></Link>
                    </div>
                </Modal.Body>
            </Modal>

        </React.Fragment>

    );
};

export default Chat;