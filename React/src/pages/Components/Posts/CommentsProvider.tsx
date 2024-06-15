import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Comment } from '../../../services/CommentService'; // Import the Comment type

interface CommentsContextType {
  comments: Comment[];
  addComment: (newComment: Comment) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (newComment: Comment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
