import React, { useEffect, useState } from 'react';
import { fetchComments, Comment, likeComment, deleteComment, editComment } from '../../../services/MediaCommentservice'; // Adjust path as needed
import { info } from 'sass';
import { ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import MediaComment from './MediaComment';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationDialog from './Delete';
import EditCommentForm from './EditComment';
import ReplymediaModal from './Replymediamodal';
import ReplymediaDisplay from './ReplymediaDisplay';
import DeleteModal from 'Common/DeleteModal';

interface DisplayCommentsProps {
    mediapostId: number;
}

const MediaDisplayComments: React.FC<DisplayCommentsProps> = ({ mediapostId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState<Comment | null>(null);
    const [activeComment, setActiveComment] = useState<Comment | null>(null);
    const [mediaComments, setMediaComments] = useState<Comment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [activemediaComment, setActivemediaComment] = useState<Comment | null>(null);
    const [username, setUsername] = useState<string>('');
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const userId = currentUser?.user?.id;
    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            try {
                const fetchedData = await fetchComments(mediapostId);
                console.log('HTTP Response', fetchedData); // Log the full response object
    
                // Ajustez ici pour accepter directement le tableau
                if (Array.isArray(fetchedData)) {
                    setComments(fetchedData);
                } else {
                    setError('No comments data returned');
                    setComments([]); // Set an empty array if no data is returned
                }
                setLoading(false);
            } catch (error: any) {
                console.error('Failed to fetch comments:', error);
                setError('Failed to load comments.');
                setLoading(false);
                setComments([]); // Ensure comments is set to an empty array on error
            }
        };
    
        loadComments();
        // const intervalId = setInterval(loadComments, 30000); // Rafraîchir toutes les 60 secondes

        // return () => clearInterval(intervalId); 
    }, [mediapostId]);

    
    
    const handleLike = async (mediacommentId: number) => {
        try {
            const updatedComment = await likeComment(mediacommentId);
            setComments(currentComments => currentComments.map(comment =>
                comment.id === mediacommentId ? {...comment, likes_count: updatedComment.likes_count} : comment
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  
    const promptDeleteComment = (commentId: number) => {
      setSelectedCommentId(commentId);
      setDialogOpen(true);
    };
  
    const handleDeleteComment = async () => {
      if (selectedCommentId === null) return;
  
      try {
        const response = await deleteComment(selectedCommentId);
        toast.success(response.message); // Display a success message
        setComments(currentComments => currentComments.filter(comment => comment.id !== selectedCommentId));
        setDialogOpen(false); // Close the dialog after successful deletion
      } catch (error) {
        console.error('Error while deleting comment:', error);
        toast.error("Unauthorized to delete this comment!")
        setDialogOpen(false); // Also close the dialog if there is an error
      }
    };
  
    const handleClose = () => {
      setDialogOpen(false); // Close the dialog without deleting
    };
      
    if (loading) return <div>Loading comments...</div>;
    if (error) return <div>Error loading comments: {error}</div>;
    console.log('Comments before render', comments);
    const handleEdit = (comment: Comment) => {
        setActiveComment(comment);
        setIsOpen(true);
      };
    
      const handleSave = async (commentData: { content: string }) => {
        if (activeComment) {
          try {
            const updatedComment = await editComment(activeComment.id, commentData);
            toast.success("Comment updated successfully!");
            // Assuming you have logic here to update the local comment state
            setComments(prevComments => prevComments.map(comment => 
              comment.id === updatedComment.id ? {...comment, ...updatedComment} : comment
            ));
          } catch (error:any) {
            console.error("Failed to update comment:", error);
            toast.error(error.response?.data?.message || "Failed to update comment!");
          }
        }
    };
    // const openModal = (mediacomment:Comment) => {
    //     if (mediacomment && mediacomment.id) { // Assuming `comment.id` is your identifier and should be non-zero
    //       setActivemediaComment(mediacomment);
    //       setIsModalOpen(true);
    //     } else {
    //       console.error("Invalid comment ID");
    //       toast.error("Cannot reply to an invalid comment.");
    //     }
    //   };
    
      const openModal = (mediacomment: Comment) => {
        if (mediacomment && mediacomment.id) { // Assuming `comment.id` is your identifier and should be non-zero
          setActivemediaComment(mediacomment);
          setIsModalOpen(true);
          if (userId !== mediacomment.user_id) {
            setUsername(`@${mediacomment.user.name} `);
          } else {
            setUsername('');
          }
        } else {
          console.error("Invalid comment ID");
          toast.error("Cannot reply to an invalid comment.");
        }
      };
    return (
        <div className="mt-5 ml-[1.5rem] ">
        {comments.map((comment, index) => (
            <div key={comment.id} className={`flex gap-3 ${index !== comments.length - 1 ? 'mb-6' : ''}`}>
            <div className="bg-yellow-100 rounded-full size-9 shrink-0 dark:bg-yellow-500/20">
                    {/* Assurez-vous que le lien vers l'image est correct */}
                    <img src={`http://localhost:8000/storage/profile_images/${comment.user.profile_image}`} alt={comment.user.name} className="rounded-full size-9" />
                </div>
                <div className="grow">
                <div className=" p-3 rounded-md bg-slate-100 dark:bg-zinc-600 w-full max-w-4xl "> {/* Ajustez 'max-w-xl' selon la largeur désirée */}
                        {/* Utilisez `Link` si vous avez un chemin de navigation ou simplement une balise `a` */}
                        <h6 className="mb-3 text-15">
                            <Link to="#!">@{comment.user.name}</Link> - 
                            <span className="text-sm font-normal text-slate-500 dark:text-zinc-200">
    {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Date non disponible"}
</span>

                        </h6>
                        <p >{comment.content}</p>
                        <div className="flex items-center gap-2 mt-4">
                            {/* Mettre à jour les événements onClick pour Like et Reply si nécessaire */}
                            
                            <button  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500" onClick={() => handleLike(comment.id)}>Like ({comment.likes_count})</button>

                            <div  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
          <button onClick={() => openModal(comment)}>Reply </button>

        </div>   
        {isModalOpen && activemediaComment && (
  <ReplymediaModal
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false);
      setActivemediaComment(null); // Optionally reset the active comment on close
    }}
    mediareplyCommentId={activemediaComment.id} // Ensure this is the correct property for your comment ID
    username={username}
    />
)}      <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
      <button  onClick={() => handleEdit(comment)}>Edit</button>
      {isOpen && activeComment && (
        <EditCommentForm
          isOpen={isOpen}
          comment={activeComment}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}    </div>                            <div  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
          <button onClick={() =>promptDeleteComment(comment.id)}>Delete</button>

        </div> 
        <DeleteModal show={isDialogOpen} onHide={handleClose} onDelete={handleDeleteComment} />

        {/* <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onConfirm={handleDeleteComment}
        message="Are you sure you want to delete this comment?"
      />          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> */}
                        </div>
                    </div>
                    <ReplymediaDisplay mediareplyCommentId={comment.id} />

                </div>
            </div>
        ))}
    </div>
    );
};

export default MediaDisplayComments;
