<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class ConversationController extends Controller
{
    public function destroy($id)
    {
        try {
            // Supprimez tous les messages pour un receiver_id donné
            Message::where('receiver_id', $id)->orWhere('user_id', $id)->delete();
            return response()->json(['message' => 'Conversation deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete conversation'], 500);
        }
    }
}
