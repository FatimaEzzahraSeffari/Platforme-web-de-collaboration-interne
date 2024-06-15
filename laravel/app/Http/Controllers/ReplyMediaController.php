<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReplyComment;
use App\Models\MediaComment; 

use Illuminate\Support\Facades\Log;
class ReplyMediaController extends Controller
{
      
    public function store(Request $request, $mediareplyCommentId)
    {
        
        $mediareplyComment = new ReplyComment( );
        $mediareplyComment->content = $request->content;
        $mediareplyComment->mediacomment_id  = $mediareplyCommentId; 
        $mediareplyComment->user_id = auth()->id(); // Assumes user is authenticated
        $mediareplyComment->save();

        return response()->json($mediareplyComment, 201);
    }

    public function index($mediareplyCommentId)
    {
        $mediareplyComment = ReplyComment::where('mediacomment_id', $mediareplyCommentId)
                                ->with('user')->withCount('likes') // assuming you want to show who replied
                                ->get();
    
        return response()->json($mediareplyComment);
    }
    
   
    
    
    public function countForPost($mediareplyCommentId)
{
    $count = ReplyComment::where('comment_id', $mediareplyCommentId)->count();

    return response()->json(['count' => $count]);
}

// Increment likes for a comment
public function like($mediareplyCommentId)
{
    $mediareplyComment = ReplyComment::find($mediareplyCommentId);
    $mediareplyComment->increment('likes_count');  // Ensure you have a likes_count column in your comments table
    return response()->json($mediareplyComment);
}


// Update a comment


public function update(Request $request, $mediareplyCommentId)
{
    $mediareplyComment = ReplyComment::find($mediareplyCommentId);

    if (!$mediareplyComment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    if ($mediareplyComment->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized to edit this comment'], 403);
    }

    $validated = $request->validate([
        'content' => 'required|string|max:1000',
    ]);

    $mediareplyComment->content = $validated['content'];
    $mediareplyComment->save();

    $mediareplyComment->refresh(); // Optional unless you have triggers or the like

    return response()->json($mediareplyComment); // Consider adding a success message or using a Resource for consistent formatting
}

// Delete a comment
public function destroy($mediareplyCommentId)
{
    $mediareplyComment = ReplyComment::find($mediareplyCommentId);

    // Check if the comment exists
    if (!$mediareplyComment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    // Check if the current authenticated user is the owner of the comment
    if ($mediareplyComment->user_id != auth()->id()) {
        return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
    }

    $mediareplyComment->delete();
    return response()->json(['message' => 'Comment deleted successfully']);
}

public function updatelike($mediareplyCommentId)
{
    $mediareplyComment = ReplyComment::withCount('likes')->findOrFail($mediareplyCommentId); // Load the comment with likes count
    $user = auth()->user(); // Get the authenticated user

    $like = $mediareplyComment->likes()->where('user_id', $user->id)->first();

    if ($like) {
        // User has already liked this comment, so remove the like
        $like->delete();
    } else {
        // User has not liked this comment, so add a new like
        $mediareplyComment->likes()->create(['user_id' => $user->id]);
    }

    $mediareplyComment->refresh();  // Reload the instance to reflect changes made
    $mediareplyComment->likes_count = $mediareplyComment->likes()->count(); // Ensure likes count is updated

    return response()->json($mediareplyComment);
}


}

