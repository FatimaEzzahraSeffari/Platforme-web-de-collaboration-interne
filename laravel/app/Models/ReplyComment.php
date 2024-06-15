<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReplyComment extends Model
{
    use HasFactory; // Ensure using Laravel's best practices

    protected $fillable = ['content', 'comment_id', 'mediacomment_id', 'user_id'];

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id');
    }

    public function mediaComment()
    {
        return $this->belongsTo(MediaComment::class, 'mediacomment_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function likes()
    {
        return $this->hasMany(Replylike::class, 'reply_comment_id');
    }
}
