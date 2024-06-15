import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';
import { getCommentsCountForPost } from 'services/CommentService';


interface CommentCountProps {
  postId: number;
  onToggleComments: () => void; // Prop to toggle comments in parent component

}

const CommentCount: React.FC<CommentCountProps> = ({ postId ,onToggleComments }) => {
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const result = await getCommentsCountForPost(postId);
        if (typeof result === 'number') { // Vérifiez si result est de type 'number'
          setCommentCount(result);
        } else {
          console.error('Structure de résultat invalide :', result);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires :', error);
        setCommentCount(0);
      }
    };

    fetchCommentCount();
    const intervalId = setInterval(fetchCommentCount, 60000); // Rafraîchir toutes les 60 secondes

    return () => clearInterval(intervalId); 
  }, [postId]);

 

  return (
    <div>
  <ul>
    <li>
      <Link to="#!" className="text-slate-500 dark:text-zink-200" onClick={onToggleComments}>
        <MessagesSquare className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
        <span className="align-middle">{commentCount} Comment{commentCount !== 1 ? 's' : ''}</span>
      </Link>
    </li>
  </ul>
</div>

  
  );
};

export default CommentCount;
