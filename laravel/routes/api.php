<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\MediaPostController;
use App\Http\Controllers\MediaCommentController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\ReplyMediaController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\VideosController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/users', [AuthController::class, 'index']);
Route::post('user/{id}', [AuthController::class, 'update']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
//admin
Route::post('admin/user/{id}', [AdminController::class, 'EditUser']);
Route::delete('admin/user/{id}', [AdminController::class, 'destroy']);
Route::post('admin/contact/{id}', [AdminController::class, 'updatecontact']);
Route::delete('admin/contact/{id}', [AdminController::class, 'destroycontact']);
//contact us 
Route::post('/contacts', [ContactController::class, 'store']);
Route::get('/contacts', [ContactController::class, 'index']);
// Routes pour les rôles
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
//message 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
    Route::put('/messages/{id}', [MessageController::class, 'editMessage']);
    Route::post('/messages/{messageId}/reply', [MessageController::class, 'replyToMessage']);
    Route::delete('conversations/{id}', [ConversationController::class, 'destroy']);


});
//reactions 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reactions', [ReactionController::class, 'store']);
    Route::get('/messages/{message}/reactions', [ReactionController::class, 'index']);
});
//videos
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/videos', [VideosController::class, 'store']);
    Route::get('/videos', [VideosController::class, 'index']);
    Route::delete('/videos/{id}', [VideosController::class, 'destroy']);

});
// Routes pour les services
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
});
    // Routes for posts
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{postId}', [PostController::class, 'destroy']);
    Route::put('/posts/{postId}', [PostController::class, 'update']);
    Route::get('posts/count', [PostController::class, 'countByUser']);


});

// Routes pour comment 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('posts/{postId}/comments', [CommentController::class, 'store']);
    Route::get('posts/{postId}/comments', [CommentController::class, 'index']);
    Route::put('comments/{commentId}', [CommentController::class, 'update']);
    Route::delete('comments/{commentId}', [CommentController::class, 'destroy']);
    Route::patch('comments/{commentId}/like', [CommentController::class, 'updatelike']);


});
Route::get('/posts/{postId}/comments/count', [CommentController::class, 'countForPost']);
//Routes pour likes
Route::middleware('auth:sanctum')->group(function () {

Route::get('/posts/{id}/likes',[PostController::class, 'getLikes'] );
Route::post('/posts/{id}/like', [PostController::class, 'toggleLike']);
});
// Routes pour favourite 
Route::middleware('auth:sanctum')->group(function () {

Route::post('/favorites/toggle', [FavoriteController::class, 'toggleFavorite']);
Route::get('/favorites', [FavoriteController::class, 'index']);
});
//Routes pour share 
Route::middleware('auth:sanctum')->group(function () {
Route::post('/posts/{postId}/share',[ShareController::class, 'share']);
});
//Routes pour media 
Route::middleware('auth:sanctum')->group(function () {
Route::post('/media-posts',[MediaPostController::class, 'store'] );
Route::get('/media-posts',[MediaPostController::class, 'index'] );
Route::delete('/media-posts/{mediapostId}', [MediaPostController::class, 'destroy']);
Route::post('media-posts/{mediapostId}', [MediaPostController::class, 'update']);
Route::get('media-posts/count', [MediaPostController::class, 'countByUser']);

});

// Routes pour mediacomment 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('mediaposts/{mediapostId}/comments', [MediaCommentController::class, 'store']);
    Route::get('mediaposts/{mediapostId}/comments', [MediaCommentController::class, 'index']);
    Route::patch('mediacomments/{mediacommentId}/like', [MediaCommentController::class, 'toggleLike']);
    Route::delete('mediacomments/{mediacommentId}', [MediaCommentController::class, 'destroy']);
    Route::put('mediacomments/{mediacommentId}', [MediaCommentController::class, 'update']);

    
});
//route pour medialike 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/mediaposts/{id}/likes',[MediaPostController::class, 'mediagetLikes'] );
    Route::post('/mediaposts/{id}/like', [MediaPostController::class, 'mediatoggleLike']);
    });
Route::get('/mediaposts/{mediapostId}/comments/count', [MediaCommentController::class, 'countForPost']);
//Routes pour mediashare 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/mediaposts/{mediapostId}/share',[ShareController::class, 'mediashare']);
    });
    //media favourite
    // Routes pour favourite
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::post('/favorites/mediatoggle', [FavoriteController::class, 'togglemediaFavorite']);
        Route::get('/mediafavorites', [FavoriteController::class, 'mediaIndex']);

        }); 
//story 
Route::middleware('auth:sanctum')->group(function () {

Route::post('stories/upload', [StoryController::class, 'upload']);
Route::get('/stories', [StoryController::class, 'getAllStories']);
}); 
// Routes pour reply comment 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('comments/{replyCommentId}/replies', [ReplyController::class, 'store']);
    Route::get('comments/{replyCommentId}/replies', [ReplyController::class, 'index']);
    Route::put('replycomments/{replyCommentId}', [ReplyController::class, 'update']);
    Route::delete('replycomments/{replyCommentId}', [ReplyController::class, 'destroy']);
    Route::patch('replycomments/{replyCommentId}/like', [ReplyController::class, 'updatelike']);
});
// Routes pour reply media comment 
Route::middleware('auth:sanctum')->group(function () {

    Route::post('mediacomments/{mediareplyCommentId}/mediareplies', [ReplyMediaController::class, 'store']);
    Route::get('mediacomments/{mediareplyCommentId}/mediareplies', [ReplyMediaController::class, 'index']);
    Route::put('mediacomments/{mediareplyCommentId}', [ReplyMediaController::class, 'update']);
    Route::delete('mediacomments/{mediareplyCommentId}', [ReplyMediaController::class, 'destroy']);
    Route::patch('mediacomments/{mediareplyCommentId}/like', [ReplyMediaController::class, 'updatelike']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

