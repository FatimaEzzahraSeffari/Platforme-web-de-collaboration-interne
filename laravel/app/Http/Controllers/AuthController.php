<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Role;
use App\Models\Service;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Models\UserRole; 
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
 
public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => ['required', 'email', 'unique:users'], 
        'password' => ['required', 'confirmed', 'min:6', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/'],
        'country_code' => 'required|string|max:5',
        'phone' =>'required|string|max:255|unique:users', 
        'role_id' => 'required|exists:roles,id', 
        'service_id' => 'required|exists:services,id',
        'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
    ]);
   

    if ($request->hasFile('profile_image')) {
        $file = $request->file('profile_image');
        $fileName = 'profile_image_' . time() . '.' . $file->getClientOriginalExtension();
        
        // Déplacez le fichier téléchargé vers le dossier storage
        $file->move(public_path('storage/profile_images'), $fileName);
    
        // Stockez uniquement le nom du fichier dans la base de données
        $profileImagePath = $fileName; 
    } else {
        $profileImagePath = null;
    }
    

 $role = Role::find($request->role_id);
 $service = Service::find($request->service_id);



    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'country_code' => $request->country_code, // Assurez-vous d'utiliser 'country_code' ici
        'phone' => $request->phone,
        'role' => $role->name, 
        'service' => $service->name, 
        'profile_image' => $profileImagePath ?? null, // Save image path or null
        'online' => false, 
        'category' => 'user',
        ]);
    
    UserRole::create([
        'user_id' => $user->id,
        'role_id' => $request->role_id,
        'service_id' => $request->service_id,
    ]);

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
        'message' => 'User successfully registered and role assigned',
        'user' => $user,
        'token' => $token,
    ], 201);

}

    
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required_without:phone|email',
        'phone' => 'required_without:email',
        'password' => 'required',
    ]);

    // Vérifier si l'utilisateur essaie de se connecter avec l'email ou le téléphone
    if ($request->filled('email')) {
        $credentials = $request->only('email', 'password');
    } elseif ($request->filled('phone')) {
        $credentials = ['phone' => $request->phone, 'password' => $request->password];
    } else {
        // Si ni l'email ni le téléphone ne sont fournis, lancer une exception de validation
        throw ValidationException::withMessages([
            'email' => ['Either email or phone number is required.'],
        ]);
    }

    if (!Auth::attempt($credentials)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $userField = $request->filled('email') ? 'email' : 'phone';
    $userValue = $request->filled('email') ? $request->email : $request->phone;
    $user = User::where($userField, $userValue)->firstOrFail();
     // Update online status
     $user->online = true;
     $user->save();
     $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
        'message' => 'User successfully logged in',
        'user' => $user,
        'token' => $token,
        'category' => $user->category,

    ]);
}
public function logout(Request $request)
{
    $user = Auth::user();

    if ($user) {
        // Update the online status using the update method
        User::where('id', $user->id)->update(['online' => false]);
    }

    // Revoke the user's current access token
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'User successfully logged out']);
}
public function index()
{
    $users = User::where('category', 'user')->get();

    return response()->json([
        'message' => 'Users retrieved successfully',
        'users' => $users
    ]);
}

//Edit user 
public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'country_code' => 'required|string|max:5',
        'phone' => 'required|string|max:255|unique:users,phone,' . $id,
        'role' => 'required|string',
        'service' => 'required|string',
        'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // profile_image est facultatif

    ]);

    $user = User::findOrFail($id);

    if ($request->hasFile('profile_image')) {
        $file = $request->file('profile_image');
        $fileName = 'profile_image_' . time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('storage/profile_images'), $fileName);
        $user->profile_image = $fileName;
    }

    $user->name = $request->name;
    $user->email = $request->email;
    $user->country_code = $request->country_code;
    $user->phone = $request->phone;
    $user->role = $request->role;
    $user->service = $request->service;
    $user->save();


    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ]);
}
}
