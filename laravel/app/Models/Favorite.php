<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'post_id','mediapost_id'];

    // If you want to directly access the Post and User models from a Favorite instance,
    // you can also define the following relationships:

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function mediapost()
    {
        return $this->belongsTo(MediaPost::class);
    }
}
