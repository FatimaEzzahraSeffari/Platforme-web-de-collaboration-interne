import React, { useEffect, useState } from 'react';
import { fetchVideos } from 'services/uploadService';

const TotalVideos: React.FC = () => {
  const [totalVideos, setTotalVideos] = useState(0);

  const loadVideos = async () => {
    try {
      const videos = await fetchVideos();
      setTotalVideos(videos.length);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadVideos();
    }, 5000); // Rafraîchir toutes les 5 secondes

    // Charger les vidéos initialement
    loadVideos();

    // Nettoyer l'intervalle à la désactivation du composant
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="py-3 sm:py-0 sm:px-3">
      <h6>{totalVideos}</h6>
      <p className="text-slate-500 dark:text-zink-200">Videos</p>
    </div>
  );
};

export default TotalVideos;
