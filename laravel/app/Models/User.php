<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'country_code',
        'phone',
        'role',
        'service',
        'profile_image',
        'online',
        'category'

    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relation avec UserRole
    public function userRoles()
    {
        return $this->hasMany(UserRole::class);
    }

    // Pour obtenir tous les rôles et services à travers userRoles
    public function roles()
    {
        return $this->userRoles()->with('role');
    }

    public function services()
    {
        return $this->userRoles()->with('service');
    }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function favorites()
    {
        return $this->belongsToMany(Post::class, 'favorites', 'user_id', 'post_id');
    }
 

    public function media_posts()
    {
        return $this->hasMany(MediaPost::class);
    }
    public function mediaFavorites()
    {
        return $this->belongsToMany(MediaPost::class, 'favorites', 'user_id', 'mediapost_id');
    }

    public function stories()
    {
        return $this->hasMany(Story::class);
    }
}

