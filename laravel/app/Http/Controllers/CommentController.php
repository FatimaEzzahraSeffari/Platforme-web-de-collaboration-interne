<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment; // Assurez-vous que ce modèle existe et est correctement défini
use Illuminate\Support\Facades\Log;
class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $comment = new Comment($request->all());
        $comment->content = $request->content;
        $comment->post_id = $postId;
        $comment->user_id = auth()->id(); // Assumes user is authenticated
        $comment->save();
        $comment->refresh(); // Optional unless you have triggers or the like

        return response()->json($comment, 201);
    }

    public function index($postId)
    {
        
        $comments = Comment::where('post_id', $postId)->with('user')->withCount('likes')->withCount('likes')->get();

        return response()->json($comments);
    }
    
    public function countForPost($postId)
{
    $count = Comment::where('post_id', $postId)->count();

    return response()->json(['count' => $count]);
}

// Increment likes for a comment
public function like($commentId)
{
    $comment = Comment::find($commentId);
    $comment->increment('likes_count');  // Ensure you have a likes_count column in your comments table
    return response()->json($comment);
}

// Update a comment
public function update(Request $request, $commentId)
{
    $comment = Comment::find($commentId);

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
public function destroy($commentId)
{
    $comment = Comment::find($commentId);

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

public function updatelike($commentId)
{
    $comment = Comment::withCount('likes')->findOrFail($commentId); // Load the comment with likes count
    $user = auth()->user(); // Get the authenticated user

    $like = $comment->likes()->where('user_id', $user->id)->first();

    if ($like) {
        // User has already liked this comment, so remove the like
        $like->delete();
    } else {
        // User has not liked this comment, so add a new like
        $comment->likes()->create(['user_id' => $user->id]);
    }

    $comment->refresh();  // Reload the instance to reflect changes made
    $comment->likes_count = $comment->likes()->count(); // Ensure likes count is updated

    return response()->json($comment);
}
}
