<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'role_id', 'service_id']; // Attributs assignables en masse.

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Relation avec Service
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}


