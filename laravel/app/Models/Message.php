<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'receiver_id', 'content', 'type', 'file_path' , 'deleted_for',
];

protected $casts = [
    'deleted_for' => 'array',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
