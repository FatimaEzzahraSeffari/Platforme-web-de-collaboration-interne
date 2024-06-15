<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaComment extends Model
{
    protected $fillable = ['content', 'mediapost_id', 'user_id'];

    public function mediapost()
{
    return $this->belongsTo(MediaPost::class);
}

public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // In your MediaComment model
public function likes()
{
    return $this->hasMany(CommentLike::class, 'mediacomment_id');
}

}
