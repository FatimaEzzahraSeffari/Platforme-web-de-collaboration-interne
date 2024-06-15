<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\MediaPost;

use Exception;

class PostController extends Controller
{
    public function index()
    {
        // Fetch posts with user information and paginate them
        $posts = Post::with('user')->latest()->paginate(15);
        return response()->json($posts);
    }

    public function store(Request $request)
{
    Log::info('Received data:', $request->all()); // Ajouter ceci pour le débogage
    $validatedData = $request->validate(['content' => 'required|string']);
    Log::info('Validated data:', $validatedData); // Ajouter ceci pour le débogage

    $post = $request->user()->posts()->create($validatedData);
    return response()->json($post, 201);
}

// Update a comment
public function update(Request $request, $postId)
{
    $comment = Post::find($postId);

    if (!$comment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    if ($comment->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized to edit this comment'], 403);
    }

    $validated = $request->validate([
        'content' => 'required|string|max:10000',
    ]);

    $comment->content = $validated['content'];
    $comment->save();

    $comment->refresh(); // Optional unless you have triggers or the like

    return response()->json($comment); // Consider adding a success message or using a Resource for consistent formatting
}
    public function destroy($postId)
    {
        $comment = Post::find($postId);
        
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
    public function toggleLike(Request $request, $postId)
{
    $user = Auth::user();
    $post = Post::with('likes')->findOrFail($postId); // Eager load likes for performance

    try {
        DB::beginTransaction();

        $like = $post->likes()->where('user_id', $user->id)->first();

        if ($like) {
            // User has already liked the post, so remove the like
            $like->delete();
            $liked = false;
        } else {
            // User hasn't liked the post yet, so add a like
            $post->likes()->create(['user_id' => $user->id]);
            $liked = true;
        }

        DB::commit();

        // Get the fresh count of likes
        $likeCount = $post->likes()->count();

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


public function getLikes($postId)
{
    $post = Post::withCount('likes')->findOrFail($postId);

    return response()->json([
        'likeCount' => $post->likes_count // 'likes_count' is populated by the withCount() Eloquent method
    ]);
}
public function countByUser(Request $request)
{
    $userId = $request->query('user_id');
    $count = Post::where('user_id', $userId)->count();
    return response()->json(['count' => $count]);
}
}
