<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Replylike extends Model
{
    protected $table = 'reply_comments_likes'; // Ensure this matches the actual table name

    protected $fillable = ['user_id', 'reply_comment_id'];

    public function replyComment()
    {
        return $this->belongsTo(ReplyComment::class, 'reply_comment_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
