<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MediaComment; 
use Illuminate\Support\Facades\Log;
class MediaCommentController extends Controller
{
   //commentmedia post 
   public function store(Request $request, $mediapostId)
   {
    $comment = new MediaComment();
    $comment->content = $request->input('content');
    $comment->mediapost_id = $mediapostId;
    $comment->user_id = auth()->id(); // Assumes user is authenticated
    
    // Save the Comment, not MediaPost.
    $comment->save();

    // Return the Comment in the response, not MediaPost.
    return response()->json($comment, 201);
   }

   public function index($mediapostId)
   {
       $comment = MediaComment::where('mediapost_id', $mediapostId)->with('user')->withCount('likes')->get();
       return response()->json($comment);
   }
   
   public function countForPost($mediapostId)
{
   $count = MediaComment::where('mediapost_id', $mediapostId)->count();
   return response()->json(['count' => $count]);
} 
public function toggleLike($mediacommentId)
{
    $comment = MediaComment::findOrFail($mediacommentId);
    $user = auth()->user(); // Get the authenticated user

    $like = $comment->likes()->where('user_id', $user->id)->first();

    if ($like) {
        // User has already liked this media comment, so remove the like
        $like->delete();
    } else {
        // User has not liked this media comment, so add a new like
        $comment->likes()->create(['user_id' => $user->id, 'mediacomment_id' => $mediacommentId]);
    }

    // Refresh and recount the likes
    $comment = MediaComment::withCount('likes')->findOrFail($mediacommentId);

    return response()->json($comment);
}
// Update a comment
public function update(Request $request, $mediacommentId)
{
    $comment = MediaComment::find($mediacommentId);

    if (!$comment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    if ($comment->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized to edit this comment'], 403);
    }

    $validated = $request->validate([
        'content' => 'required|string|max:1000',
    ]);

    $comment->content = $validated['content'];
    $comment->save();

    $comment->refresh(); // Optional unless you have triggers or the like

    return response()->json($comment); // Consider adding a success message or using a Resource for consistent formatting
}

// Delete a comment
public function destroy($mediacommentId)
{
    $comment = MediaComment::find($mediacommentId);

    // Check if the comment exists
    if (!$comment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    // Check if the current authenticated user is the owner of the comment
    if ($comment->user_id != auth()->id()) {
        return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
    }

    $comment->delete();
    return response()->json(['message' => 'Comment deleted successfully']);
}

}