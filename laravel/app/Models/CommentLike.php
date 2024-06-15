<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentLike extends Model
{
    protected $fillable = ['comment_id', 'user_id','mediacomment_id'];

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
    public function mediaComment()
    {
        return $this->belongsTo(MediaComment::class, 'mediacomment_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    use HasFactory;
}
