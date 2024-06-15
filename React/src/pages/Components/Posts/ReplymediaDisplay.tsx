import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ReplyService, fetchReplyComments, updateReplyComment } from 'services/Replyservice';
import EditCommentForm from './EditComment';
import ConfirmationDialog from './Delete';
import ReplymediaModal from './Replymediamodal';
import { mediafetchReplyComments } from 'services/Replymediaservice';
import DeleteModal from 'Common/DeleteModal';

interface Comment {
    likes_count:number;
    user: any;
    id: number;
    content: string;
    user_id: number;
    created_at?: string;
    mediareplies?: Comment[];  // Assuming backend can nest replies

}

interface DisplayCommentsProps {
    mediareplyCommentId: number;
    originalCommentId?: number; // Optional prop to keep track of the original comment ID

}

const ReplymediaDisplay: React.FC<DisplayCommentsProps> = ({ mediareplyCommentId,originalCommentId }) => {
    const [mediareplies, setmediaReplies] = useState<Comment[]>([]);
    const [medialoading, setmediaLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activereplyComment, setActivereplyComment] = useState<Comment | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isModalreplyOpen, setIsModalreplyOpen] = useState(false);
    const [activemediareplyComment, setActivemediareplyComment] = useState<Comment | null>(null);
  
    useEffect(() => {
        const loadmediaReplies = async () => {
            setmediaLoading(true);
            setError(null);
            try {
                const fetchedComments = await mediafetchReplyComments(mediareplyCommentId);
                console.log("hhhh:",fetchedComments)
                if (Array.isArray(fetchedComments) && fetchedComments.length > 0) {
                    setmediaReplies(fetchedComments);
                    // Load replies for each comment
                   
                } else {
                    setError('No comments data returned');
                    setmediaReplies([]);
                }
            } catch (error: any) {
                console.error('Failed to fetch comments or replies:', error);
                setError('Failed to load comments and replies.');
            } finally {
                setmediaLoading(false);
            }
        };
    
        loadmediaReplies();
    
        const intervalId = setInterval(loadmediaReplies, 60000); // Refresh every 60 seconds
    
        return () => clearInterval(intervalId);
    }, [mediareplyCommentId]);
    
    
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const userId = currentUser?.user?.id;
    const [username, setUsername] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeReplyComment, setActiveReplyComment] = useState<Comment | null>(null);

    // Construct the profile image URL using the profile_image from currentUser.user
    const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
      ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
      : undefined;
      const handleLike = async (mediareplyCommentId: number) => {
        try {
            const updatedComment = await ReplyService.likeReplyComment(mediareplyCommentId);
            setmediaReplies(mediacurrentReplies => mediacurrentReplies.map(mediareplyComment =>
                mediareplyComment.id === mediareplyCommentId ? {...mediareplyComment, likes_count: updatedComment.likes_count} : mediareplyComment
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };
    //edit 
    const handleEdit = (mediareplyCommentId: Comment) => {
        setActivereplyComment(mediareplyCommentId);
        setIsOpen(true);
      };
    
      const handleSave = async (commentData: { content: string }) => {
        if (activereplyComment) {
          try {
            const updatedComment = await updateReplyComment(activereplyComment.id, commentData);
            toast.success("Comment updated successfully!");
            // Assuming you have logic here to update the local comment state
            setmediaReplies(prevComments => prevComments.map(mediacomment => 
              mediacomment.id === updatedComment.id ? {...mediacomment, ...updatedComment} : mediacomment
            ));
          } catch (error:any) {
            console.error("Failed to update comment:", error);
            toast.error(error.response?.data?.message || "Failed to update comment!");
          }
        }
    };
    //delete
    const promptDeleteComment = (mediareplyCommentId: number) => {
        setSelectedCommentId(mediareplyCommentId);
        setDialogOpen(true);
      };
    
      const handleDeleteComment = async () => {
        if (selectedCommentId === null) return;
    
        try {
          const response = await ReplyService.deleteReplyComment(selectedCommentId);
          toast.success(response.message); // Display a success message
          setmediaReplies(currentReplies => currentReplies.filter(mediareplyComment => mediareplyComment.id !== selectedCommentId));
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
       //reply
       
       const handleReplyModal = (reply: Comment) => {
        // D'abord, décider de la valeur de username avant d'ouvrir le modal
        setActiveReplyComment(reply); // Définissez le commentaire actif pour lequel l'utilisateur veut répondre
        if (userId !== reply.user_id) {
          setUsername(`@${reply.user.name} `);
        } else {
          setUsername('');
        }
        // Ensuite, ouvrir le modal après avoir mis à jour l'état de username
        setIsModalOpen(true);
    };
    
     
    
    return (
        <div>
        {mediareplies.map(reply => (
            <div key={reply.id} className="flex gap-3 mt-4">
                <div className="bg-green-100 rounded-full w-9 h-9 shrink-0 dark:bg-green-500/20">
                    {/* Assuming avatar image is available in the reply object or a default avatar */}
                    <img src={`http://localhost:8000/storage/profile_images/${reply.user.profile_image}`} alt={reply.user.name} className="rounded-full size-9" />
                </div>
                <div className="grow">
                    <div className="p-3 rounded-md bg-slate-100 dark:bg-zinc-600">
                        <h6 className="mb-3 text-sm">
                            <Link to="#!" >@{reply.user?.name}</Link> - 
                            <span className="text-sm font-normal text-slate-500 dark:text-zinc-200">
    {reply.created_at ? new Date(reply.created_at).toLocaleString() : "Date non disponible"}
</span>

                        </h6>
                        <p className="mb-1">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-4">
                        <div  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">

                        <button onClick={() => handleLike(reply.id)}>Like ({reply.likes_count})</button>
                        </div>

                        <div  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
                        <button  onClick={() => handleReplyModal(reply)}>Reply</button>
                                {reply.mediareplies && <ReplymediaDisplay mediareplyCommentId={reply.id} />}

        </div>   
      
        {isModalOpen && activeReplyComment && (
                <ReplymediaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mediareplyCommentId={originalCommentId || mediareplyCommentId} // Use the originalCommentId if available
                    username={username}
                    />
            )}

                            <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
      <button  onClick={() => handleEdit(reply)}>Edit</button>
                </div>

      {isOpen && activereplyComment && (
        <EditCommentForm
          isOpen={isOpen}
          comment={activereplyComment}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}                

       <div  className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
          <button onClick={() =>promptDeleteComment(reply.id)}>Delete</button>

        </div> 
        <DeleteModal show={isDialogOpen} onHide={handleClose} onDelete={handleDeleteComment} />

        {/* <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onConfirm={handleDeleteComment}
        message="Are you sure you want to delete this comment?"
      />          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> */}

                        </div>  </div>
                        </div>
                    </div>
        ))}
    </div>
    );
};

export default ReplymediaDisplay;
