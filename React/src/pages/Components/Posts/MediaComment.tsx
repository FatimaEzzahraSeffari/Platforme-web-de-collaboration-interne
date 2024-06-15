// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { MediaPostData } from 'services/MediaService';

// interface MediaPostProps {
//   posts: MediaPostData[];
// }

// function formatTimeAgo(postCreatedAt: string | number | Date | undefined) {
//     if (postCreatedAt) { // Assurez-vous que created_at n'est pas undefined
//       const date = new Date(postCreatedAt);
//       const now = new Date();
//       const difference = now.getTime() - date.getTime();
  
//       const minutes = Math.floor(difference / 60000);
//       const hours = Math.floor(minutes / 60);
//       const days = Math.floor(hours / 24);
//       const weeks = Math.floor(days / 7);
//       const months = Math.floor(days / 30);
//       const years = Math.floor(days / 365);
  
//       if (minutes < 60) {
//         return `${minutes} min`;
//       } else if (hours < 24) {
//         return `${hours} h`;
//       } else if (days < 7) {
//         return `${days} j`;
//       } else if (weeks < 4) {
//         return `${weeks} semaines`;
//       } else if (months < 12) {
//         return `${months} mois`;
//       } else {
//         return `${years} an(s)`;
//       }
//     } else {
//       return "Date inconnue"; // Gérer le cas où la date n'est pas définie
//     }
// }
// const MediaPostList: React.FC<MediaPostProps> = ({ posts }) => {
//     const storedUser = localStorage.getItem('user');
//     const currentUser = storedUser ? JSON.parse(storedUser) : null;

//     const userId = currentUser?.user?.id;

//     // Construct the profile image URL using the profile_image from currentUser.user
//     const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
//       ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
//       : undefined;
//       console.log(posts); // Ajouter ce console.log pour inspecter les données des posts
//       const [mediaposts, setMediaPosts] = useState<MediaPostData[]>([]);

//       const combinedPosts = [...posts, ...mediaposts];
//       const sortedPosts = combinedPosts.sort((a, b) => {
//         const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
//         const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
//         return dateB - dateA;
//       });
//   return (
//     <>
    
//       {sortedPosts.map((post) => (
//                 <div key={post.id} className="card mb-4 w-full max-w-5xl">
//           <div className="card-body">
//             <div className="flex flex-wrap items-center gap-3 mb-5">
//               {/* User and post metadata */}
//               <div className="size-102 bg-green-100 rounded-full shrink-0 dark:bg-green-500/20">
//               <img src={`http://localhost:8000/storage/profile_images/${post.user.profile_image}`} alt="User avatar" className="size-12 rounded-full" />
//               </div>
//               <div className="grow">
//                 <h6 className="mb-1 text-15">
//                   <Link to="#!" className="hover:text-custom-500">{post.user?.name}</Link>
//                   <small className="ml-1 font-normal text-slate-500 dark:text-zink-200">
//               {formatTimeAgo(post.created_at)}
//             </small> 
//                 </h6>
//                 <p className="text-slate-500">{post.user?.role} at <Link to="https://www.ocpgroup.ma/fr" className="underline">{post.user?.service}</Link></p>
//               </div>
//             </div>
//             <div className="mb-5">
//   <p className="font-bold text-slate-900 dark:text-gray-400">{post.title}</p>
//   <div className="text-slate-900 dark:text-gray-400">{post.description}</div>
// </div>

//             {/* Conditional rendering for media content */}
//             {post.media_url && (
//   /\.(jpeg|jpg|gif|png)$/.test(post.media_url) ? (
// <img src={`http://localhost:8000/storage/${(post.media_url)}`} alt="Post Media" className="w-full" />
//   ) : (
//     <video controls className="w-full" onLoadedMetadata={() => console.log(`Video loaded: ${post.media_url}`)} onError={() => console.log(`Failed to load video: ${post.media_url}`)}>
//       <source src={`http://localhost:8000/storage/${(post.media_url)}`} type="video/mp4" />
//       Your browser does not support the video tag.
//     </video>
//   )
// )}

// <div className="font-normal text-slate-600 dark:text-gray-400">
//   {post.mention}
// </div>





// </div>
//           </div>
//       ))}
//     </>
//   );
// };

// export default MediaPostList;
import React, { useState } from 'react';
import { postComment } from '../../../services/MediaCommentservice';
import { ToastContainer, toast } from 'react-toastify';

interface CommentFormProps {
  mediapostId: number;
}

const  MediaCommentComponent: React.FC<CommentFormProps> = ({ mediapostId }) => {
  const [mediacomment, setmediaComment] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (mediacomment.trim()) {
        try {
          // Attempt to post the comment
          await postComment(mediapostId, { content: mediacomment });
          // If the post is successful, clear the comment field and show a success toast
          setmediaComment('');
          toast.success("Comment created successfully!");
        } catch (error) {
          // If there is an error in posting the comment, show an error toast
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
              value={mediacomment}
              onChange={(e) => setmediaComment(e.target.value)}
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

export default MediaCommentComponent;
