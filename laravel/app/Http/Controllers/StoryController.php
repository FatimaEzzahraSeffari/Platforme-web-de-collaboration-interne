<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StoryController extends Controller
{
    public function upload(Request $request)
    {
        Log::info("Uploading media");
        
        $request->validate([
            'media' => 'required|file|mimes:jpg,jpeg,png,mp4|max:1024000', // 1 GB Max
        ]);

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $fileName = 'story_' . time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('storage/stories');
            
            // Ensure the directory exists
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            // Move the file to the designated directory
            try {
                $file->move($destinationPath, $fileName);
            } catch (\Exception $e) {
                Log::error("Failed to move the file. Error: " . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to move the file.'
                ], 500);
            }
            
            $mediaPath = 'stories/' . $fileName;
            $mediaType = in_array($file->getClientOriginalExtension(), ['mp4']) ? 'video' : 'image';

            $story = new Story([
                'user_id' => $request->user()->id,
                'media_path' => $mediaPath,
                'media_type' => $mediaType,
            ]);
            $story->save();
            
            Log::info("Media uploaded: " . $mediaPath);

            return response()->json([
                'data' => [
                    'mediaPath' => $mediaPath,
                    'mediaType' => $mediaType,
                    'storyId' => $story->id
                ],
                'message' => 'Upload successful'
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
    
    public function getAllStories()
    {
        // Fetch all stories from the database with user data
        $stories = Story::with('user')->get();
    
        return response()->json($stories);
    }
    
}
