<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MediaPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

use Exception;
class MediaPostController extends Controller
{
   
    public function index()
    {
        // Fetch posts with user information and paginate them
        $MediaPost = MediaPost::with('user')->latest()->paginate(11);
        return response()->json($MediaPost);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'mention' => 'nullable|string',
            'media' => 'required|file|max:1099511627776|mimes:jpeg,png,jpg,gif,svg,mp4,mov,pdf,doc,docx,txt,xlsx,xls,ppt,pptx' // Limite de 1TB pour les fichiers
        ]);
    
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $fileName = 'media_post_' . time() . '.' . $file->getClientOriginalExtension();
    
            // Ensure the directory exists
            $destinationPath = public_path('storage/media_posts');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
    
            // Move the file to the designated directory
            $file->move($destinationPath, $fileName);
           
            // Store only the file name or the path as needed in the database
            $mediaUrl = 'media_posts/' . $fileName;
        } else {
            $mediaUrl = null; // Handle the case where no file is uploaded
        }
    
        $mediaPost = new MediaPost();
        $mediaPost->user_id = auth()->id();  // Récupération de l'ID de l'utilisateur authentifié
        $mediaPost->title = $validatedData['title'];
        $mediaPost->description = $validatedData['description'];
        $mediaPost->mention = $validatedData['mention'] ?? null;
        $mediaPost->media_url = $mediaUrl;
        $mediaPost->save();
    
        return response()->json($mediaPost, 201);
    }
    
    public function mediatoggleLike(Request $request, $mediapostId)
    {
        $user = Auth::user();
        $mediapost = MediaPost::with('likes')->findOrFail($mediapostId); // Eager load likes for performance
    
        try {
            DB::beginTransaction();
    
            $like = $mediapost->likes()->where('user_id', $user->id)->first();
    
            if ($like) {
                // User has already liked the post, so remove the like
                $like->delete();
                $liked = false;
            } else {
                // User hasn't liked the post yet, so add a like
                $mediapost->likes()->create(['user_id' => $user->id]);
                $liked = true;
            }
    
            DB::commit();
    
            // Get the fresh count of likes
            $likeCount = $mediapost->likes()->count();
    
            return response()->json([
                'liked' => $liked,
                'likeCount' => $likeCount
            ]);
        } catch (Exception $exception) {
            DB::rollback();
            Log::error('Error toggling the like for post: ' . $exception->getMessage());
            return response()->json(['error' => 'Error toggling like'], 500);
        }
    }
    
    
    public function mediagetLikes($mediapostId)
    {
        $mediapost = MediaPost::withCount('likes')->findOrFail($mediapostId);
    
        return response()->json([
            'likeCount' => $mediapost->likes_count // 'likes_count' is populated by the withCount() Eloquent method
        ]);
    }  
    public function destroy($mediapostId)
    {
        $comment = MediaPost::find($mediapostId);
        
        // Check if the comment exists
        if (!$comment) {
            return response()->json(['message' => 'post not found'], 404);
        }
    
        // Check if the current authenticated user is the owner of the comment
        if ($comment->user_id != auth()->id()) {
            return response()->json(['message' => 'Unauthorized to delete this post'], 403);
        }
    
        $comment->delete();
        return response()->json(['message' => 'post deleted successfully']);
    }
    
    public function update(Request $request, $mediapostId)
    {
        $mediaPost = MediaPost::findOrFail($mediapostId);
        if ($mediaPost->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized to edit this media post'], 403);
        }
    
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'mention' => 'nullable|string',
            'media' => 'sometimes|file|max:1073741824|mimes:jpeg,png,jpg,gif,svg,mp4,mov,pdf,doc,docx,txt,xlsx,xls,ppt,pptx'
        ]);
    
        if ($request->hasFile('media')) {
            $oldFileName = $mediaPost->media_url;
            if ($oldFileName && Storage::exists('public/' . $oldFileName)) {
                Storage::delete('public/' . $oldFileName);
            }
    
            $file = $request->file('media');
            $fileName = 'media_post_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/media_posts'), $fileName);
            $mediaPost->media_url = 'media_posts/' . $fileName;  // Make sure this path is correct
        }
    
        $mediaPost->title = $validatedData['title'];
        $mediaPost->description = $validatedData['description'];
        $mediaPost->mention = $validatedData['mention'] ?? null;
    
        $mediaPost->save();
    
        return response()->json($mediaPost);
    }
    public function countByUser(Request $request)
{
    $userId = $request->query('user_id');
    $count = MediaPost::where('user_id', $userId)->count();
    return response()->json(['count' => $count]);
}
    

    
}
