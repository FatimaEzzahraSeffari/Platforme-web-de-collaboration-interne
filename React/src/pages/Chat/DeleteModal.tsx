import React from "react";

// Icons
import { X } from 'lucide-react';

// Image
import deleteImg from "assets/images/delete.png";
import Modal from "Common/Components/Modal";

interface props {
    show: boolean;
    onHide: () => void;
    onDeleteForMe: () => void;
    onDeleteForEveryone: () => void;
    modalPosition: { top: number, left: number };
    deleteType: 'me' | 'everyone'; // Define the type of deleteType
}

const DeleteModal: React.FC<props> = ({ show, onHide,onDeleteForMe, onDeleteForEveryone, modalPosition, deleteType }) => {
    return (
        <React.Fragment>
            <Modal show={show} onHide={onHide} id="deleteModal" modal-center="true" className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4" dialogClassName='w-screen md:w-[25rem] bg-white shadow rounded-md dark:bg-zink-600'>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto px-6 py-8">
                    <div className="float-right">
                        <button data-modal-close="deleteModal" className="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500"><X className="size-5" onClick={onHide} /></button>
                    </div>
                    <img src={deleteImg} alt="" className="block h-12 mx-auto" />
                    <div className="mt-5 text-center">
                        <h5 className="mb-1">Are you sure?</h5>
                        <p className="text-slate-500 dark:text-zink-200">Are you certain you want to delete this message?</p>
                        <div className="flex flex-col justify-center gap-2 mt-6">
                            <a
                                className="text-slate-500 hover:text-red-500 cursor-pointer"
                                onClick={onHide}
                            >
                                Cancel
                            </a>
                            {deleteType === 'everyone' && (
                                <a
                                className="text-red-500 cursor-pointer hover:text-red-600"
                                onClick={onDeleteForEveryone}
                            >
                                Delete for everyone
                            </a>
                             )}
                            <a
                                className="text-red-500 cursor-pointer hover:text-red-600"
                                onClick={onDeleteForMe}
                            >
                                Delete for me
                            </a>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default DeleteModal;