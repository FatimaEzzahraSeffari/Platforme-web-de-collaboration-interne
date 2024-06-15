import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface PostData {
    content: string;
}

interface Props {
    isOpen: boolean;
    post: PostData | null;
    onClose: () => void; // Function to close the modal
    onSave: (postData: PostData) => void; // Function to save the edited post
}

const EditPostModal: React.FC<Props> = ({ isOpen, post, onClose, onSave }) => {
    const [postContent, setPostContent] = useState("");
    useEffect(() => {
        if (post) {
            setPostContent(post.content);
        }
    }, [post]);

   
 
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (post) {
            try {
                await onSave({ content: postContent });  // Use onSave instead of direct service call
                onClose();
            } catch (error) {
                console.error("Failed to update comment:", error);

            }
        }
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-slate-700 dark:border-zinc-500">
                <form onSubmit={handleSubmit}>
                <button
        onClick={onClose}
        className="absolute top-0 right-0 p-2 text-black dark:text-white"
        aria-label="Close modal"
      >
        &#10005;
      </button>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Edit Post
            </h2>
      <hr className="border-b border-gray dark:border-white mb-4" />
                    <div className="mt-2">
                        <textarea
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full dark:bg-slate-500 sm:text-sm border border-gray-300 rounded-md dark:bg-slate-5000 dark:border-zinc-500 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            rows={3}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
