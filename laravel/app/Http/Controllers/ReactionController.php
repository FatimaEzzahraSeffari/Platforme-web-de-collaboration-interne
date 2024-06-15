<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reaction;
use Illuminate\Support\Facades\DB;

class ReactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:messages,id',
            'receiver_id' => 'required|exists:users,id',
            'emoji' => 'required|string|max:5',
        ]);

        // Check if the user has already reacted to this message
        $existingReaction = Reaction::where('message_id', $request->message_id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingReaction) {
            // Update the existing reaction
            $existingReaction->emoji = $request->emoji;
            $existingReaction->save();
            return response()->json($existingReaction, 200);
        } else {
            // Create a new reaction
            $reaction = Reaction::create([
                'message_id' => $request->message_id,
                'user_id' => auth()->id(),
                'receiver_id' => $request->receiver_id,
                'emoji' => $request->emoji,
            ]);

            return response()->json($reaction, 201);
        }
    }

    public function index($messageId)
{
    $reactions = Reaction::where('message_id', $messageId)
        ->select('emoji', DB::raw('count(*) as count'))
        ->groupBy('emoji')
        ->get();

    return response()->json($reactions);
}

}
