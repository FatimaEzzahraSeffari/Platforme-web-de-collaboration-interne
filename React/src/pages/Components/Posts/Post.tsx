import React, { useEffect, useState } from 'react';
import PostService, { CreatePostData, PostData } from '../../../services/PostService'; // Adjust the relative path as necessary
import avatar1 from "assets/images/users/avatar-1.png";
import { ToastContainer, toast } from 'react-toastify';

const PostComponent: React.FC = () => {
  const [content, setContent] = useState('');
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Construct the profile image URL using the profile_image from currentUser.user
  const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
    ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
    : undefined;
// Replace with your actual default image path


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submitted'); // Pour le débogage
    event.preventDefault();
    try {
      const postData: CreatePostData = {
        content: content // Utilisez le state ici
      };
      const response = await PostService.createPost(postData);
      console.log("Post created:", response);
      
      setContent(''); // Réinitialiser le champ après l'envoi
      toast.success("Post created successfully!");


    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");

    }
  };
 
  console.log('Current user data:', currentUser);
  if (!currentUser.profile_image) {
    console.error('Profile image is missing from the current user data');
  }
  
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex gap-3 mt-4">
      <div className="bg-pink-100 rounded-full size-9 shrink-0 dark:bg-pink-500/20">
      <img src={profileImageUrl} alt="Current User" className="rounded-full size-9" />

       </div>
      <div className="grow">
        <textarea
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          id="textArea"
          placeholder="Share your thoughts ..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
    <div className="mt-4 text-right">
      <button
        type="submit"
        className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
      >
        Share Post
      </button>
    </div>
    <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

  </form>

  );
};

export default PostComponent;
