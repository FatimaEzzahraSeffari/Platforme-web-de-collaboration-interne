<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Share;
use Illuminate\Http\Request;

class ShareController extends Controller
{
    public function share(Request $request, $postId) {
        $userId = $request->user()->id; // Assuming user is authenticated

        // Create a new share entry
        Share::create([
            'post_id' => $postId,
            'user_id' => $userId
        ]);

        // Count the total shares for the post
        $shareCount = Share::where('post_id', $postId)->count();

        return response()->json(['shareCount' => $shareCount]);
    }
//media share
    public function mediashare(Request $request, $mediapostId) {
        $userId = $request->user()->id; // Assuming user is authenticated

        // Create a new share entry
        Share::create([
            'mediapost_id' => $mediapostId,
            'user_id' => $userId
        ]);

        // Count the total shares for the post
        $shareCount = Share::where('mediapost_id', $mediapostId)->count();

        return response()->json(['shareCount' => $shareCount]);
    }
}
