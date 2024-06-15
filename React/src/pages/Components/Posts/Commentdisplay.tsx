import React, { useEffect, useState } from 'react';
import { fetchComments, Comment, CommentService, editComment,CommentData } from '../../../services/CommentService'; // Adjust path as needed
import { info } from 'sass';
import { ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import { useComments } from './CommentsProvider';
import ConfirmationDialog from './Delete';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import EditCommentForm from './EditComment';
import ReplyModalForm from './Replymodal';
import { fetchReplyComments } from 'services/Replyservice';
import ReplyDisplay from './ReplyDisplay';
import DeleteModal from 'Common/DeleteModal';

interface DisplayCommentsProps {
    postId: number;
}


const DisplayComments: React.FC<DisplayCommentsProps> = ({ postId }) => {
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeComment, setActiveComment] = useState<Comment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activemediaComment, setActivemediaComment] = useState<Comment | null>(null);
    const [username, setUsername] = useState<string>('');
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = currentUser?.user?.id;

  useEffect(() => {
    const loadCommentsAndReplies = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedComments = await fetchComments(postId);
        if (Array.isArray(fetchedComments)) {
          // Spread into a new array to ensure new reference
          setComments([...fetchedComments]);
        } else {
          setError('No comments data returned');
          setComments([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch comments:', error);
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };

    loadCommentsAndReplies();
  }, [postId]);



  // Dépendance sur `comments`
  // La dépendance sur `comments` assure que les réponses sont rechargées si les commentaires changent

  // Re-run effect if postId changes


  const handleLike = async (commentId: number) => {
    try {
      const updatedComment = await CommentService.likeComment(commentId);
      setComments(currentComments => currentComments.map(comment =>
        comment.id === commentId ? { ...comment, likes_count: updatedComment.likes_count } : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };



  const promptDeleteComment = (commentId: number) => {
    setSelectedCommentId(commentId);
    setDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (selectedCommentId === null) return;

    try {
      const response = await CommentService.deleteComment(selectedCommentId);
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


  // Function to handle modal close

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
          comment.id === updatedComment.id ? { ...comment, ...updatedComment } : comment
        ));
      } catch (error: any) {
        console.error("Failed to update comment:", error);
        toast.error(error.response?.data?.message || "Failed to update comment!");
      }
    }
  };


  // Function to handle reply click


  const openModal = (comment: Comment) => {
    if (comment && comment.id) {
      setActivemediaComment(comment);
      setIsModalOpen(true);
      if (userId !== comment.user_id) {
        setUsername(`@${comment.user.name} `);
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
                <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
                  <button onClick={() => handleLike(comment.id)}>Like ({comment.likes_count})</button>

                </div>
                <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
                  <button onClick={() => openModal(comment)}>Reply </button>

                </div>
                {isModalOpen && activemediaComment && (
                  <ReplyModalForm
                    isOpen={isModalOpen}
                    onClose={() => {
                      setIsModalOpen(false);
                      setActivemediaComment(null); // Optionally reset the active comment on close
                    }}
                    commentId={activemediaComment.id} // Ensure this is the correct property for your comment ID
                    username={username}
                  />
                )}


                <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
                  <button onClick={() => handleEdit(comment)}>Edit</button>
                  {isOpen && activeComment && (
                    <EditCommentForm
                      isOpen={isOpen}
                      comment={activeComment}
                      onClose={() => setIsOpen(false)}
                      onSave={handleSave}
                    />
                  )}    </div>

                <div className="px-2.5 py-0.5 text-xs font-medium rounded border bg-white border-slate-200 text-slate-500 transition hover:bg-slate-200 dark:text-zinc-200 dark:bg-slate-700 dark:border-zinc-500">
                  <button onClick={() => promptDeleteComment(comment.id)}>Delete</button>

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
            <ReplyDisplay replyCommentId={comment.id} />

          </div>

        </div>

      ))}

    </div>
  );
};

export default DisplayComments;
