// import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp, faHeart, faLaugh, faSmile, faGrimace, faAngry, faThumbsDown, faFire } from '@fortawesome/free-solid-svg-icons';
// import { getReactions, reactToMessage } from 'services/apiService';

// interface Reaction {
//   id: number; // Replace with appropriate type if needed
//   emoji: string;
//   userId: number; // Optional: User ID if displaying user information
// }

// interface Props {
//   messageId: number;
//   onReactionAdded?: (newReaction: Reaction) => void; // Optional callback for parent component
// }

// const ReactionButton: React.FC<Props> = ({ messageId, onReactionAdded }) => {
//   const emojiPickerRef: React.Ref<HTMLDivElement> = useRef(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
//   const [reactions, setReactions] = useState<Reaction[]>([]); // State for fetched reactions

//   useEffect(() => {
//     const fetchInitialReactions = async () => {
//       try {
//         const response = await getReactions(messageId);
//         setReactions(response.data); // Update state with fetched reactions
//       } catch (error) {
//         console.error('Error fetching initial reactions:', error);
//       }
//     };

//     fetchInitialReactions();

//     const handleClickOutside = (event: MouseEvent) => {
//       if (emojiPickerRef.current && event.target instanceof Node) {
//         const targetNode: Node = event.target;

//         if (!targetNode.contains(event.target)) {
//           setShowEmojiPicker(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [emojiPickerRef, messageId]);

//   const handleReactionClick = async (emojiName: string) => {
//     setSelectedEmoji(emojiName);
//     const emojiCode = getEmojiCode(emojiName); // Convert emoji name to SVG code
//     try {
//       const response = await reactToMessage(messageId, emojiCode);
//       onReactionAdded && onReactionAdded(response.data); // Pass the new reaction data if callback exists
//     } catch (error) {
//       console.error('Error adding reaction:', error);
//     }
//   };

//   const getEmojiCode = (emojiName: string) => {
//     switch (emojiName) {
//       case 'thumbsUp':
//         return faThumbsUp; // Return the SVG code for thumbsUp
//       case 'heart':
//         return faHeart; // Return the SVG code for heart
//       // ... add other emoji cases
//       default:
//         return ''; // Return an empty string if the emoji is not found
//     }
//   };

//   const toggleEmojiPicker = () => {
//     setShowEmojiPicker((prevShow) => !prevShow);
//   };

//   return (
//     <div className="reaction-button-container">
//       <button className="reaction-button" onClick={toggleEmojiPicker}>
//         {selectedEmoji || <FontAwesomeIcon icon={faThumbsUp} />}
//       </button>

//       {showEmojiPicker && (
//         <div className="emoji-picker" ref={emojiPickerRef}>
//           <div className="emoji-picker-limited">
//             <button className="emoji-button" onClick={() => handleReactionClick('thumbsUp')}>
//               <FontAwesomeIcon icon={faThumbsUp} />
//             </button>
//             <button className="emoji-button" onClick={() => handleReactionClick('heart')}>
//               <FontAwesomeIcon icon={faHeart} />
//             </button>
//             <button className="emoji-button" onClick={() => handleReactionClick('laugh')}>
//               <FontAwesomeIcon icon={faLaugh} />
//             </button>
//             <button className="emoji-button" onClick={() => handleReactionClick('smile')}>
//               <FontAwesomeIcon icon={faSmile} />
//             </button>
//             <button className="emoji-button" onClick={() => handleReactionClick('grimace')}>
//               <FontAwesomeIcon icon={faGrimace} />
//             </button>
//           </div>
//           <button className="emoji-button-more" onClick={toggleEmojiPicker}>
//             <FontAwesomeIcon icon={faFire} />
//           </button>
//         </div>
//       )}

//       {/* Added the missing closing tag for the last div */}
//     </div>
//   );
// };

// export default ReactionButton;