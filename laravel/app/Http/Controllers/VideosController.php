<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class VideosController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'files.*' => 'nullable|file|max:1073741824|mimes:mp4,mov,webm,mkv,flv,vob,gif',
            'url' => 'nullable|url',
            'thumbnail' => 'nullable|string',
            'title' => 'nullable|string',
        ]);

        if (Auth::user()->role !== 'Collaborator') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Default thumbnail URL
        $defaultThumbnailUrl = asset('storage/thumbnail.png');

        if ($request->hasFile('files')) {
            $videos = [];
            foreach ($request->file('files') as $file) {
                $fileName = 'video_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                
                // Ensure the directory exists
                $destinationPath = public_path('storage/videos');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
        
                // Move the file to the designated directory
                $file->move($destinationPath, $fileName);
        
                // Store only the file name or the path as needed in the database
                $filePath = 'videos/' . $fileName;
        
            
                  
                $videoData = [
                    'thumbnail' => $request->thumbnail ?? $defaultThumbnailUrl,
                    'title' => $request->title,
                    'user_id' => Auth::id(),
                    'url' => $fileName, 
                ];

                $videos[] = Video::create($videoData);
            }
        } elseif ($request->url) {
            $videoData = [
                'thumbnail' => $request->thumbnail ?? $defaultThumbnailUrl,
                'title' => $request->title,
                'user_id' => Auth::id(),
                'url' => $request->url,
            ];

            $videos[] = Video::create($videoData);
        } else {
            return response()->json(['error' => 'No media provided'], 422);
        }

        return response()->json($videos, 201);
    }

    public function index()
{
    // Afficher toutes les vidéos pour tous les utilisateurs
    $videos = Video::all();
    return response()->json($videos, 200);
}

    //destroy
    public function destroy($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        if ($video->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $video->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}

