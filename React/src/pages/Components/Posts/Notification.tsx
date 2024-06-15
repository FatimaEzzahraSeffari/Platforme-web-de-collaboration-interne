// import React, { useState, useEffect } from 'react';

// interface NotificationProps {
//   message: string;
//   type: 'info' | 'success';
// }

// const Notification: React.FC<NotificationProps> = ({ message, type }) => {
//   const [visible, setVisible] = useState<boolean>(false);

//   useEffect(() => {
//     if (message !== '') {
//       setVisible(true);
//       setTimeout(() => {
//         setVisible(false);
//       }, 5000); // La notification disparait après 5 secondes
//     }
//   }, [message]);

//   return (
//     <div className={`${visible ? 'block' : 'hidden'} fixed top-5 right-5 bg-white text-black p-2 border rounded ${type === 'success' ? 'border-green-500' : 'border-blue-500'} z-50`}>
//       {message}
//     </div>
//   );
// };
// export default Notification;
