import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ReplyService, fetchReplyComments, updateReplyComment } from 'services/Replyservice';
import EditCommentForm from './EditComment';
import ConfirmationDialog from './Delete';
import ReplyModalForm from './Replymodal';
import DeleteModal from 'Common/DeleteModal';

interface Comment {
    likes_count:number;
    user: any;
    id: number;
    content: string;
    user_id: number;
    created_at?: string;
    replies?: Comment[];  // Assuming backend can nest replies

}

interface DisplayCommentsProps {
    replyCommentId: number;
    originalCommentId?: number; // Optional prop to keep track of the original comment ID

}

const ReplyDisplay: React.FC<DisplayCommentsProps> = ({ replyCommentId,originalCommentId }) => {
    const [replies, setReplies] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activereplyComment, setActivereplyComment] = useState<Comment | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [activeReplyComment, setActiveReplyComment] = useState<Comment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
        const loadReplies = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedComments = await fetchReplyComments(replyCommentId);
                if (Array.isArray(fetchedComments) && fetchedComments.length > 0) {
                    setReplies(fetchedComments);
                    // Load replies for each comment
                   
                } else {
                    setError('No comments data returned');
                    setReplies([]);
                }
            } catch (error: any) {
                console.error('Failed to fetch comments or replies:', error);
                setError('Failed to load comments and replies.');
            } finally {
                setLoading(false);
            }
        };
    
        loadReplies();
    
        const intervalId = setInterval(loadReplies, 60000); // Refresh every 60 seconds
    
        return () => clearInterval(intervalId);
    }, [replyCommentId]);
    
    
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const userId = currentUser?.user?.id;
    const [username, setUsername] = useState<string>('');

    // Construct the profile image URL using the profile_image from currentUser.user
    const profileImageUrl = currentUser && currentUser.user && currentUser.user.profile_image
      ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(currentUser.user.profile_image)}`
      : undefined;
      const handleLike = async (replyCommentId: number) => {
        try {
            const updatedComment = await ReplyService.likeReplyComment(replyCommentId);
            setReplies(currentReplies => currentReplies.map(replyComment =>
                replyComment.id === replyCommentId ? {...replyComment, likes_count: updatedComment.likes_count} : replyComment
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };
    //edit 
    const handleEdit = (replyComment: Comment) => {
        setActivereplyComment(replyComment);
        setIsOpen(true);
      };
    
      const handleSave = async (commentData: { content: string }) => {
        if (activereplyComment) {
          try {
            const updatedComment = await updateReplyComment(activereplyComment.id, commentData);
            toast.success("Comment updated successfully!");
            // Assuming you have logic here to update the local comment state
            setReplies(prevComments => prevComments.map(comment => 
              comment.id === updatedComment.id ? {...comment, ...updatedComment} : comment
            ));
          } catch (error:any) {
            console.error("Failed to update comment:", error);
            toast.error(error.response?.data?.message || "Failed to update comment!");
          }
        }
    };
    //delete
    const promptDeleteComment = (replyCommentId: number) => {
        setSelectedCommentId(replyCommentId);
        setDialogOpen(true);
      };
    
      const handleDeleteComment = async () => {
        if (selectedCommentId === null) return;
    
        try {
          const response = await ReplyService.deleteReplyComment(selectedCommentId);
          toast.success(response.message); // Display a success message
          setReplies(currentReplies => currentReplies.filter(replyComment => replyComment.id !== selectedCommentId));
          setDialogOpen(false); // Close the dialog after successful deletion
        } catch (error) {
          console.error('Error while deleting comment:', error);
          toast.error("Unauthorized to delete this comment!")
          setDialogOpen(false); // Also close the dialog if there is an error
        }
      }
    
      const handleClose = () => {
        setDialogOpen(false); // Close the dialog without deleting
      };
       //reply
const handleReplyModal = (reply: Comment) => {
    // First, decide the value of username before opening the modal
    setActiveReplyComment(reply);  // Ensure the active comment is set

    if (userId !== reply.user_id) {
      setUsername(`@${reply.user.name} `);
    } else {
      setUsername('');
    }
    // Then, open the modal after updating the username state
    setIsModalOpen(true);
};

    
  
  

    return (
        <div>
        {replies.map(reply => (
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
                                {reply.replies && <ReplyDisplay replyCommentId={reply.id} />}

        </div>   
      
        {isModalOpen && activeReplyComment && (
                <ReplyModalForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    commentId={originalCommentId || replyCommentId} // Use the originalCommentId if available
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

export default ReplyDisplay;
