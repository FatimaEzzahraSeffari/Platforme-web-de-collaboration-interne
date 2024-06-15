import React, { useState, useEffect, FormEvent } from 'react';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { MediaService } from 'services/MediaService'; // Ensure correct import path
import Modal from "Common/Components/Modal";
import { UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
interface MediaPostData {
    id: number;
    title: string;
    description: string;
    mention: string;
    media_url: string; // Assuming this is part of your data structure
}

interface Props {
    isOpen: boolean;
    mediaPost: MediaPostData | null;
    onClose: () => void;

}

const ModalEdit: React.FC<Props> = ({ isOpen, mediaPost, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mention, setMention] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [defaultModal, setDefaultModal] = useState<boolean>(false);
    const defaultToggle = () => setDefaultModal(!defaultModal);
   
    const [selectfiles, setSelectfiles] = useState([]);
    const [mediaposts, setMediaPosts] = useState<MediaPostData[]>([]);

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
    const handleFilesAccepted = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    };
   
    
    useEffect(() => {
        if (mediaPost) {
            setTitle(mediaPost.title);
            setDescription(mediaPost.description);
            setMention(mediaPost.mention ?? '');
        }
    }, [mediaPost]);
    const handleMediaPostUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // To prevent page reload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (mention) formData.append('mention', mention);
    
        // Append new media only if selected
        if (selectfiles.length > 0) {
            selectfiles.forEach(file => {
                formData.append('media', file);
            });
        }
    
        try {
          const updatedPost = await MediaService.editmediaPost(mediaPost!.id, formData); // Ensure mediaPost.id is correct
          console.log('Media post updated:', updatedPost);
        //   if (updatedPost) {
        //     // Update local state with the new media post data
        //     setMediaPosts(prevMediaPosts => 
        //       prevMediaPosts.map(post => post.id === updatedPost.id ? {...post, ...updatedPost} : post)
        //     );
            toast.success("Media post updated successfully!");
            if (updatedPost && updatedPost.id) {
                setMediaPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === updatedPost.id) {
                        // Spread the existing media post and override with updated data
                        return { ...post, ...updatedPost };
                    }
                    return post;
                }));
            onClose(); // Close the modal if open
          } else {
            toast.error("Update failed: No data returned");
          }// Optionally reload or update local state to reflect changes
        } catch (error) {
          console.error('Error updating media post:', error);
          toast.error("Failed to update media post."); // Show error toast notification
        }
    }
    
    
    if (!isOpen) return null;


    return (
        <Modal show={isOpen} onHide={onClose} modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
        <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
            closeButtonClass="transition-all duration-200 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500">
            <Modal.Title className="text-16">   Edit Post Image / Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
            <form onSubmit={handleMediaPostUpdate}>
                <div className="mb-4">
                    <label htmlFor="postTitle" className="inline-block mb-2 text-base font-medium">Post Title</label>
                    <input type="text" id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter title" />
                </div>
                <div className="mb-4">
                    <label htmlFor="descriptionInput" className="inline-block mb-2 text-base font-medium">Description</label>
                    <textarea   value={description} onChange={(e) => setDescription(e.target.value)} className="form-input  border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="descriptionInput" rows={3}></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="mentionUserSelect" className="inline-block mb-2 text-base font-medium">@Mention</label>
                    <input value={mention} onChange={(e) => setMention(e.target.value)} className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" id="mentionUserSelect" data-choices data-choices-text-unique-true type="text"  />
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
                                    <li key={file.name} className="mt-5" id="dropzone-preview-list2">
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
    );
};

export default ModalEdit;
