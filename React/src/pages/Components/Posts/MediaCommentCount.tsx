import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';
import { getCommentsCountForPost } from 'services/MediaCommentservice';

interface CommentCountProps {
  mediapostId: number;
  onTogglemediaComments: () => void; // Prop to toggle comments in parent component
}

const MediaCommentCount: React.FC<CommentCountProps> = ({ mediapostId,onTogglemediaComments }) => {
  const [mediacommentCount, setMediaCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const result = await getCommentsCountForPost(mediapostId);
        if (typeof result === 'number') { // Vérifiez si result est de type 'number'
          setMediaCommentCount(result);
        } else {
          console.error('Structure de résultat invalide :', result);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires :', error);
        setMediaCommentCount(0);
      }
    };

    fetchCommentCount();
    const intervalId = setInterval(fetchCommentCount, 60000); // Rafraîchir toutes les 60 secondes

    return () => clearInterval(intervalId); 
  }, [mediapostId]);

  return (
    <div>
    <ul>
      <li>      <Link to="#!" className="text-slate-500 dark:text-zink-200"onClick={onTogglemediaComments}>
        <MessagesSquare className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
        <span className="align-middle">{mediacommentCount} Comment{mediacommentCount !== 1 ? 's' : ''}</span>
      </Link>
      </li>
  </ul>
</div>
  );
};

export default MediaCommentCount;
