<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
class LikeController extends Controller
{
    public function toggleLike(Request $request)
{
    $user_id = $request->user_id;
    $post_id = $request->post_id;
    
    $like = Like::where('user_id', $user_id)->where('post_id', $post_id)->first();

    if ($like) {
        $like->delete();
        return response()->json(['liked' => false]);
    } else {
        Like::create(['user_id' => $user_id, 'post_id' => $post_id]);
        return response()->json(['liked' => true]);
    }
}
public function mediatoggleLike(Request $request)
{
    $user_id = $request->user_id;
    $mediapost_id = $request->mediapost_id;
    
    $like = Like::where('user_id', $user_id)->where('mediapost_id', $mediapost_id)->first();

    if ($like) {
        $like->delete();
        return response()->json(['liked' => false]);
    } else {
        Like::create(['user_id' => $user_id, 'mediapost_id' => $mediapost_id]);
        return response()->json(['liked' => true]);
    }
}

}
