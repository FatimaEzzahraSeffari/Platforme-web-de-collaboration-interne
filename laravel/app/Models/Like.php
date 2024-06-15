<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = ['user_id', 'post_id','mediapost_id'];
    
    // Define the relationship back to the Post model
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
 // Define the relationship back to the Postmedia model
 public function mediapost()
 {
     return $this->belongsTo(MediaPost::class);
 }
    // Define the relationship back to the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
