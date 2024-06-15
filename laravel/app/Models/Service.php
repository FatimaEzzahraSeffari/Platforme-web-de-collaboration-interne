<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name']; // Permet l'assignation en masse du nom du service.

    // Comme pour Role, pas besoin d'une méthode directe pour userRoles ici.
}
