<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->string('country_code'); // Ajout du champ 'country_code'
        $table->string('phone'); // Ajout du champ 'phone'
        $table->string('role')->nullable(); // Modifié pour utiliser le type string
        $table->string('service')->nullable();
        $table->string('profile_image')->nullable(); // Add this line
        $table->rememberToken();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
