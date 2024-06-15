import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { postReplyComment,CommentData  } from 'services/Replyservice';

interface ReplyFormProps {
  commentId: number;
  isOpen: boolean;
  onClose: () => void;
  username: string;  // Username of the comment owner

  
}

const ReplyModal: React.FC<ReplyFormProps> = ({ commentId, isOpen, onClose,username }) => {
  const [reply, setReply] = useState('');

  // Clear the reply when modal is opened or closed
  useEffect(() => {
    console.log("Modal state changed. isOpen:", isOpen, "Username:", username);
    if (isOpen) {
        if (username) {
            setReply(username);
        } else {
            setReply('');  // S'assurer que c'est vide si username n'est pas défini
        }
    }
}, [isOpen, username]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!commentId) {
      toast.error("Invalid comment ID provided.");
      onClose();
      return;
    }
    if (reply.trim()) {
      try {
        const newReply = await postReplyComment(commentId, { content: reply });
        toast.success("Reply posted successfully!");
        
        onClose(); // Close the modal after successful posting
      } catch (error: any) {
        console.error("Failed to post reply:", error.response?.data?.message || error.message);
        toast.error("Failed to post reply!");
      }
    } else {
      toast.error("Reply cannot be empty.");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-slate-700 dark:border-zinc-500">
    <button
        onClick={onClose}
        className="absolute top-0 right-0 p-2 text-black dark:text-white"
        aria-label="Close modal"
      >
        &#10005;
      </button>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Post a Reply            </h2>
      <hr className="border-b border-gray dark:border-white mb-4 w-full" />        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full dark:bg-slate-500 sm:text-sm border border-gray-300 rounded-md dark:bg-slate-5000 dark:border-zinc-500    focus:outline-none  disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100  dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
            rows={3}
            placeholder="Write your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex justify-end">
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
              Post Reply
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ReplyModal;
