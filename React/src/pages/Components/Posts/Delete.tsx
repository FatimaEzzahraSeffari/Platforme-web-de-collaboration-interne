import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl relative dark:bg-slate-700 dark:border-zinc-500">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-2 text-black dark:text-white"
        aria-label="Close modal"
      >
        &#10005;
      </button>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Delete Modal ?
      </h2>
      <hr className="border-b border-gray dark:border-white mb-4" />
      <p className="text-gray-800 text-lg md:text-xl mb-4 dark:text-gray-300">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-150"
        >
Cancel       
 </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
        >
Delete 
        </button>
      </div>
    </div>
  </div>
  );
};

export default ConfirmationDialog;
