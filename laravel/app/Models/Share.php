<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    
    use HasFactory;
    protected $fillable = ['post_id', 'user_id','mediapost_id'];

}
