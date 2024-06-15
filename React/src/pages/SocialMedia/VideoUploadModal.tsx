import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import Modal from 'Common/Components/Modal';
import { Link, UploadCloud } from 'lucide-react';
import { fetchVideos, uploadVideo } from 'services/uploadService';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewVideo: (video: Video) => void;
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onNewVideo }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const handleAcceptFiles = (acceptedFiles: File[]) => {
    const formattedFiles = acceptedFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...formattedFiles]);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleDrop = (acceptedFiles: File[]) => {
    handleAcceptFiles(acceptedFiles);
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0 && !url) {
        alert('Please provide a file or a URL');
        return;
    }

    try {
        const uploadedVideos: Video[] = [];

        if (files.length > 0) {
            for (const file of files) {
                const response = await uploadVideo([file], '', title, thumbnail);
                uploadedVideos.push(response);
                onNewVideo(response);  // Ajout immédiat de chaque vidéo uploadée
            }
        }

        if (url) {
            const response = await uploadVideo([], url, title, thumbnail);
            uploadedVideos.push(response);
            onNewVideo(response);  // Ajout immédiat de chaque vidéo uploadée
        }

        console.log('Videos uploaded', uploadedVideos);

        setFiles([]);
        setUrl('');
        setThumbnail('');
        setTitle('');
        setSelectedFiles([]);
        onClose();
    } catch (error) {
        console.error('Error uploading video', error);
    }
};



  return (
    <Modal show={isOpen} onHide={onClose} modal-center="true"
      className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
      dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
      <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
        closeButtonClass="transition-all duration-200 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500">
        <Modal.Title className="text-16">Add Video</Modal.Title>
      </Modal.Header>
      <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="postTitle" className="inline-block mb-2 text-base font-medium">Video Title</label>
            <input
              type="text"
              id="postTitle"
              className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="inline-block mb-2 text-base font-medium">Videos</label>
            <Dropzone onDrop={handleDrop} multiple>
              {({ getRootProps, getInputProps }) => (
                <div className="flex items-center justify-center bg-white border border-dashed rounded-md cursor-pointer dropzone border-slate-300 dropzone2 dark:bg-zink-700 dark:border-zink-500" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="w-full py-5 text-lg text-center dz-message needsclick">
                    <div className="mb-3">
                      <UploadCloud className="block size-12 mx-auto text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-600" />
                    </div>
                    <h5 className="mb-0 font-normal text-slate-500 dark:text-zink-200 text-15">Drag and drop your videos</h5>
                  </div>
                </div>
              )}
            </Dropzone>

            <ul className="flex flex-wrap mb-0 gap-x-5" id="dropzone-preview2">
              {selectedFiles.map((file, index) => (
                <li className="mt-5" key={index} id="dropzone-preview-list2">
                  <div className="border rounded border-slate-200 dark:border-zink-500">
                    <div className="p-2 text-center">
                      <div>
                        <div className="p-2 mx-auto rounded-md size-14 bg-slate-100 dark:bg-zink-500">
                          <img className="block w-full h-full rounded-md" src={file.preview} alt={file.name} />
                        </div>
                      </div>
                      <div className="pt-3">
                        <h5 className="mb-1 text-15">{file.path}</h5>
                        <p className="mb-0 text-slate-500 dark:text-zink-200">{file.formattedSize}</p>
                        <strong className="text-red-500 error"></strong>
                      </div>
                      <div className="mt-2">
                        <button className="px-2 py-1.5 text-xs text-white bg-purple-500 border-purple-500 btn hover:text-white hover:bg-purple-600 hover:border-purple-600 focus:text-white focus:bg-purple-600 focus:border-purple-600 focus:ring focus:ring-purple-100 active:text-white active:bg-purple-600 active:border-purple-600 active:ring active:ring-purple-100 dark:ring-purple-400/10" onClick={() => {
                          const newFiles = selectedFiles.filter((_, i) => i !== index);
                          setSelectedFiles(newFiles);
                          setFiles(newFiles.map((file) => file));
                        }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <label htmlFor="videoUrl" className="block mb-2">Or enter a video URL:</label>
              <input
                type="url"
                id="videoUrl"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setFiles([]);
                  setSelectedFiles([]);
                }}
                placeholder="Enter video URL"
              />
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Upload</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VideoUploadModal;
