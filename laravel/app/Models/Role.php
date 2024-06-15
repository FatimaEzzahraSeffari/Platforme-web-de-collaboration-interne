<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name']; // Permet l'assignation en masse du nom du rôle.
    
    // Vous pourriez envisager d'ajouter des méthodes ou des attributs supplémentaires ici,
    // mais la relation directe à userRoles() n'est plus nécessaire si elle est gérée par UserRole.
}
