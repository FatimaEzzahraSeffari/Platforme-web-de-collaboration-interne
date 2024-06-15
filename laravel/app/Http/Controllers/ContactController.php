<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'phone' => 'required|string|max:20',
            'company_name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'comments' => 'required|string',
        ]);

        $contact = Contact::create($validatedData);

        return response()->json($contact, 201);
    }
}
