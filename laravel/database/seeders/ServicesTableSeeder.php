<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('services')->insert(['name' => 'DSI']);
        DB::table('services')->insert(['name' => 'JFC2']);
        DB::table('services')->insert(['name' => 'JFC3']);
        DB::table('services')->insert(['name' => 'JFC4']);
        DB::table('services')->insert(['name' => 'JFC5']);
        DB::table('services')->insert(['name' => 'IMACID']);
        DB::table('services')->insert(['name' => 'EMAPHOS']);
        DB::table('services')->insert(['name' => 'PAKPHOS']);
        DB::table('services')->insert(['name' => 'JESA']);
    }
}
