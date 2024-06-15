<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReplyComment; // Assurez-vous que ce modèle existe et est correctement défini
use Illuminate\Support\Facades\Log;
class ReplyController extends Controller
{

    public function store(Request $request, $replyCommentId)
    {
        
        $replyComment = new ReplyComment( );
        $replyComment->content = $request->content;
        $replyComment->comment_id  = $replyCommentId; 
        $replyComment->user_id = auth()->id(); // Assumes user is authenticated
        $replyComment->save();

        return response()->json($replyComment, 201);
    }

    public function index($replyCommentId)
    {
        $replyComment = ReplyComment::where('comment_id', $replyCommentId)
                                ->with('user')->withCount('likes') // assuming you want to show who replied
                                ->get();
    
        return response()->json($replyComment);
    }
    

    
    public function countForPost($replyCommentId)
{
    $count = ReplyComment::where('comment_id', $replyCommentId)->count();

    return response()->json(['count' => $count]);
}

// Increment likes for a comment
public function like($replyCommentId)
{
    $replyComment = ReplyComment::find($replyCommentId);
    $replyComment->increment('likes_count');  // Ensure you have a likes_count column in your comments table
    return response()->json($replyComment);
}


// Update a comment


public function update(Request $request, $replyCommentId)
{
    $replyComment = ReplyComment::find($replyCommentId);

    if (!$replyComment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    if ($replyComment->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized to edit this comment'], 403);
    }

    $validated = $request->validate([
        'content' => 'required|string|max:100000000',
    ]);

    $replyComment->content = $validated['content'];
    $replyComment->save();

    $replyComment->refresh(); // Optional unless you have triggers or the like

    return response()->json($replyComment); // Consider adding a success message or using a Resource for consistent formatting
}

// Delete a comment
public function destroy($replyCommentId)
{
    $replyComment = ReplyComment::find($replyCommentId);

    // Check if the comment exists
    if (!$replyComment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    // Check if the current authenticated user is the owner of the comment
    if ($replyComment->user_id != auth()->id()) {
        return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
    }

    $replyComment->delete();
    return response()->json(['message' => 'Comment deleted successfully']);
}

public function updatelike($replyCommentId)
{
    $replyComment = ReplyComment::withCount('likes')->findOrFail($replyCommentId); // Load the comment with likes count
    $user = auth()->user(); // Get the authenticated user

    $like = $replyComment->likes()->where('user_id', $user->id)->first();

    if ($like) {
        // User has already liked this comment, so remove the like
        $like->delete();
    } else {
        // User has not liked this comment, so add a new like
        $replyComment->likes()->create(['user_id' => $user->id]);
    }

    $replyComment->refresh();  // Reload the instance to reflect changes made
    $replyComment->likes_count = $replyComment->likes()->count(); // Ensure likes count is updated

    return response()->json($replyComment);
}


}

