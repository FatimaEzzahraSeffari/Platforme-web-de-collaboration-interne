<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'OCPLINKAdmin',
            'email' => 'OCPLINK.admin@gmail.com',
            'password' => Hash::make('OCPLINK@admin2024'),
            'country_code' => '+212',
            'phone' => '715111493',
            'role'=>'Manager',
            'service'=>'OCP',
            'profile_image' => 'https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg', 
            'online' => false,
            'category' => 'admin', 
        ]);
    }
}
