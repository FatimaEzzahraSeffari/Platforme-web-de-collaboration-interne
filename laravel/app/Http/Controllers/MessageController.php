<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Reaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Events\MessageSent;
use Carbon\Carbon;
use App\Events\MessageReacted;
use App\Http\Requests\StoreReactionRequest;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'nullable|string',
            'type' => 'required|string|in:text,audio,media,document',
            'file' => 'sometimes|required|file|max:1073741824|mimes:jpeg,png,jpg,gif,svg,mp4,mov,pdf,doc,docx,txt,xlsx,xls,ppt,pptx,mp3,webm,aiff,au,mid,midi,m4a,wav,wma' // Limite de 1GB pour les fichiers
        ]);
    
        try {
            Log::info('Storing message', ['data' => $request->all()]);
    
            // Handle file upload if present
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = 'message_' . time() . '.' . $file->getClientOriginalExtension();
    
                // Ensure the directory exists
                $destinationPath = public_path('storage/messages');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
    
                // Move the file to the designated directory
                $file->move($destinationPath, $fileName);
    
                // Store only the file name or the path as needed in the database
                $filePath = 'messages/' . $fileName;
            } else {
                $filePath = null; // Handle the case where no file is uploaded
            }
    
            // Set message content to null or an empty string if there is no content provided
            $messageContent = $validatedData['content'] ?? '';
    
            $message = Message::create([
                'user_id' => auth()->id(),
                'receiver_id' => $validatedData['receiver_id'],
                'content' => $messageContent,
                'type' => $validatedData['type'],
                'file_path' => $filePath,
            ]);
    
            Log::info('Message stored', ['message' => $message]);
    
            broadcast(new MessageSent($message))->toOthers();
    
            return response()->json($message->load('user'), 201);
        } catch (\Exception $e) {
            Log::error('Error storing message: ' . $e->getMessage());
            return response()->json(['error' => 'Message storing failed: ' . $e->getMessage()], 500);
        }
    }
    
    public function index(Request $request)
{
    try {
        $currentUserId = $request->user()->id;
        Log::info('Current user ID: ' . $currentUserId);

        // Retrieve all conversations for the current user
        $messages = Message::where('user_id', $currentUserId)
        ->orWhere('receiver_id', $currentUserId)
        ->with('user')
        ->get()
                            ->map(function ($message) use ($currentUserId, $request) {
                                $message->isSender = $message->user_id == $currentUserId;
                                $message->senderProfileImage = $message->isSender ? $request->user()->profile_image : $message->user->profile_image;

                                // Add the full URL for the attached file, if present
                                if ($message->file_path) {
                                    $message->file_url = url('storage/' . $message->file_path);
                                    Log::info('Generated file URL: ' . $message->file_url);
                                }

                                return $message;
                            });

        return response()->json($messages);
    } catch (\Exception $e) {
        Log::error('Error fetching messages: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch messages'], 500);
    }
}

    //destroy
    public function destroy(Request $request, $id)
    {
        try {
            $message = Message::findOrFail($id);
            $currentUserId = $request->user()->id;
            $deleteFor = $request->query('deleteFor');

            // Check if the message is less than 30 minutes old
            $isDeletableForAll = $message->created_at->gt(Carbon::now()->subMinutes(30));

            if ($deleteFor === 'me') {
                if ($message->user_id === $currentUserId || $message->receiver_id === $currentUserId) {
                    // Logic to mark as deleted only for the current user
                    $deletedFor = $message->deleted_for ? $message->deleted_for : [];
                    $deletedFor[] = $currentUserId;
                    $message->deleted_for = array_unique($deletedFor);
                    $message->save();

                    Log::info('Message marked as deleted for the current user: ', ['message' => $message, 'user_id' => $currentUserId]);
                    return response()->json(['message' => 'Message deleted for you'], 200);
                } else {
                    return response()->json(['error' => 'Unauthorized to delete this message'], 403);
                }
            }

            if ($deleteFor === 'everyone') {
                if ($message->user_id === $currentUserId) {
                    if ($isDeletableForAll) {
                        $message->delete();
                        Log::info('Message deleted for all: ', ['message' => $message]);
                        return response()->json(['message' => 'Message deleted for everyone'], 200);
                    } else {
                        return response()->json(['error' => 'Message cannot be deleted for everyone after 30 minutes'], 403);
                    }
                } else {
                    return response()->json(['error' => 'Unauthorized to delete this message for everyone'], 403);
                }
            }

            return response()->json(['error' => 'Invalid deleteFor parameter'], 400);
        } catch (\Exception $e) {
            Log::error('Error deleting message: ' . $e->getMessage());
            return response()->json(['error' => 'Message deletion failed: ' . $e->getMessage()], 500);
        }
    }
    //Edit message 
    public function editMessage(Request $request, $id)
    {
        $validatedData = $request->validate([
            'content' => 'required|string',
        ]);

        try {
            $message = Message::findOrFail($id);

            if ($message->type !== 'text') {
                return response()->json(['error' => 'Only text messages can be edited'], 403);
            }

            if ($message->user_id !== Auth::id()) {
                return response()->json(['error' => 'You are not authorized to edit this message'], 403);
            }

            $message->content = $validatedData['content'];
            $message->save();

            Log::info('Message edited', ['message' => $message]);

            return response()->json($message->load('user'), 200);
        } catch (\Exception $e) {
            Log::error('Error editing message: ' . $e->getMessage());
            return response()->json(['error' => 'Message editing failed: ' . $e->getMessage()], 500);
        }
    }
  
//reply
public function replyToMessage(Request $request, $messageId)
{
    $validated = $request->validate([
        'content' => 'required|string',
        'reply_to' => 'required|integer|exists:messages,id',
        'user_id' => 'required|integer|exists:users,id',
        'receiver_id' => 'required|integer|exists:users,id',
        'type' => 'required|string', 
    ]);

    $message = new Message();
    $message->content = $validated['content'];
    $message->user_id = $validated['user_id'];
    $message->receiver_id = $validated['receiver_id'];
    $message->reply_to = $validated['reply_to'];
    $message->type = $validated['type']; 
    $message->save();

    return response()->json($message, 201);
}

}

