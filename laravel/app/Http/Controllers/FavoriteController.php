<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite; 

class FavoriteController extends Controller
{
    public function toggleFavorite(Request $request) {
        $userId = $request->user()->id;
        $postId = $request->post_id;
    
        $favorite = Favorite::where('user_id', $userId)
                            ->where('post_id', $postId)
                            ->first();
    
        $isFavorited = false;
        if ($favorite) {
            $favorite->delete();
        } else {
            Favorite::create([
                'user_id' => $userId,
                'post_id' => $postId
            ]);
            $isFavorited = true;
        }
    
        // Recalculer le nombre de favoris pour ce post
        $favoritesCount = Favorite::where('post_id', $postId)->count();
    
        return response()->json([
            'status' => 'success',
            'isFavorited' => $isFavorited,
            'favorites_count' => $favoritesCount
        ]);
    }
    
    public function index(Request $request)
{
    // Eager load the user and count of favorites for each post.
    $userFavorites = $request->user()->favorites()
        ->with('user')
        ->withCount('favorites')
        ->get();

    return response()->json($userFavorites);
}

//favourite media post 
public function toggleMediaFavorite(Request $request) {
    $userId = $request->user()->id;
    $mediaPostId = $request->mediapost_id;

    $favorite = Favorite::where('user_id', $userId)
                        ->where('mediapost_id', $mediaPostId)
                        ->first();

    $isFavorited = false;
    if ($favorite) {
        $favorite->delete();
    } else {
        Favorite::create([
            'user_id' => $userId,
            'mediapost_id' => $mediaPostId
        ]);
        $isFavorited = true;
    }

    // Recalculer le nombre de favoris pour ce mediapost
    $favoritesCount = Favorite::where('mediapost_id', $mediaPostId)->count();

    return response()->json([
        'status' => 'success',
        'isFavorited' => $isFavorited,
        'favorites_count' => $favoritesCount  // Ajouter ce champ dans la réponse
    ]);
}

public function mediaIndex(Request $request)
{
    $mediaFavorites = $request->user()->mediaFavorites()
        ->with(['user', 'favorites' => function ($query) {
            // If you simply want to count the favorites for the MediaPost instances, use withCount.
        }])
        ->withCount('favorites') // This counts the number of favorites for each MediaPost.
        ->get();

    return response()->json($mediaFavorites);
}



}
