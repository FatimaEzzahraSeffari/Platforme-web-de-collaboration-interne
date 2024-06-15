<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{

    protected $fillable = ['content','likes_count'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function comments()
{
    return $this->hasMany(Comment::class);
}
public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function favorites()
    {
        // This will define a many-to-many relationship through the favorites table
        return $this->belongsToMany(User::class, 'favorites', 'post_id', 'user_id');
    }
    protected $appends = ['favorites_count'];

    public function getFavoritesCountAttribute() {
        return $this->favorites()->count();
    }
    use HasFactory;
}
