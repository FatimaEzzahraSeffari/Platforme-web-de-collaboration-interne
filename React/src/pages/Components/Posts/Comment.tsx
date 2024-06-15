import React, { useEffect, useState } from 'react';
import { postComment } from '../../../services/CommentService';
import { ToastContainer, toast } from 'react-toastify';
import { useComments } from './CommentsProvider';

interface CommentFormProps {
  postId: number;
}
interface Comment {
  id: number;
  content: string;
}
const  CommentComponent: React.FC<CommentFormProps> = ({ postId }) => {
 
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');

  // Effect for logging updates to comments
  useEffect(() => {
      console.log("Updated comments:", comments);
  }, [comments]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (comment.trim()) {
        try {
            const newComment = await postComment(postId, { content: comment });
            // Ensure the data structure matches what the state expects
            setComments(prevComments => [...prevComments, newComment]);
            setComment(''); // Clear the input field after submission
            toast.success("Comment created successfully!");
        } catch (error:any) {
            console.error("Failed to create comment:", error.response?.data?.message || error.message);
            toast.error("Failed to create comment!");
        }
    }
};





  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Construct profile image URL or use a default avatar if none exists
  const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
    ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
    : "assets/images/users/avatar-1.png"; // Default avatar path if no profile image is available



  return (
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mt-4">
          <div className="bg-pink-100 rounded-full size-9 shrink-0 dark:bg-pink-500/20">
            <img src={profileImageUrl} alt="Current User" className="rounded-full size-9" />
          </div>
          <div className="grow">
            <input
              type="text"
              className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              placeholder="Write your comment ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="shrink-0">
            <button
              type="submit"
              className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            >
              Send
            </button>
          </div>
        </div>
        <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      </form>

    </div>
  );
};

export default CommentComponent;
