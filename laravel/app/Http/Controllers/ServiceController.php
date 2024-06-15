<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|unique:services,name',
        ]);
        
        $service = Service::create($request->only('name'));
        return response()->json($service, 201);
    }

    // Comme pour le RoleController, vous pouvez ajouter des méthodes pour show(), update(), et destroy() selon vos besoins.
}
