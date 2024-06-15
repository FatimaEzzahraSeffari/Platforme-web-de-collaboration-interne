import React, { useEffect, useState } from 'react';
import { FavoritesService } from 'services/FavoritesService';
import { MediaPostData } from 'services/MediaService';
import { PostData } from 'services/PostService';

const TotalFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<PostData[]>([]);
  const [mediafavorites, setmediaFavorites] = useState<MediaPostData[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const loadFavorites = async () => {
    try {
      const favoritePosts = await FavoritesService.fetchFavorites();
      setFavorites(favoritePosts || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadMediaFavorites = async () => {
    try {
      const mediaFavoritePosts = await FavoritesService.fetchmediaFavorites();
      setmediaFavorites(mediaFavoritePosts || []);
    } catch (error) {
      console.error('Error loading media favorites:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadFavorites();
      loadMediaFavorites();
    }, 5000); // Rafraîchir toutes les 5 secondes

    // Charger les favoris initialement
    loadFavorites();
    loadMediaFavorites();

    // Nettoyer l'intervalle à la désactivation du composant
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setTotalFavorites(favorites.length + mediafavorites.length);
  }, [favorites, mediafavorites]);

  return (
    <div className="py-3 sm:py-0 sm:px-3">
      <h6>{totalFavorites}</h6>
      <p className="text-slate-500 dark:text-zink-200">Favorites</p>
    </div>
  );
};

export default TotalFavorites;
