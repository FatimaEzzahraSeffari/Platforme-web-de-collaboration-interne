<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Support\Facades\Log;
class AdminController extends Controller
{
 //edit user
    public function EditUser(Request $request, $id)
    {
        Log::info('Request data: ', $request->all()); // Ajoutez cette ligne pour loguer les données de la requête

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

        Log::info('Updated user: ', $user->toArray()); // Ajoutez cette ligne pour loguer les données de l'utilisateur mis à jour

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }
    //delete user
    public function destroy($id)
{
    $user = User::findOrFail($id);

    if ($user->profile_image) {
        $imagePath = public_path('storage/profile_images/' . $user->profile_image);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }

    $user->delete();

    return response()->json([
        'message' => 'User deleted successfully'
    ]);
}
//edit contact
public function updatecontact(Request $request, $id)
    {
        Log::info('Request data: ', $request->all());

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'company_name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'comments' => 'required|string|max:1000',
        ]);

        $contact = Contact::findOrFail($id);
        $contact->first_name = $request->first_name;
        $contact->last_name = $request->last_name;
        $contact->email = $request->email;
        $contact->phone = $request->phone;
        $contact->company_name = $request->company_name;
        $contact->subject = $request->subject;
        $contact->comments = $request->comments;
        $contact->save();

        Log::info('Updated contact: ', $contact->toArray());

        return response()->json([
            'message' => 'Contact updated successfully',
            'contact' => $contact
        ]);
    }

    public function destroycontact($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted successfully'
        ]);
    }
}