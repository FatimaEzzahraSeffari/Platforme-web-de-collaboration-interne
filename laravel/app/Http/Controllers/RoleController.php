<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|unique:roles,name',
        ]);
        
        $role = Role::create($request->only('name'));
        return response()->json($role, 201);
    }

   
}
