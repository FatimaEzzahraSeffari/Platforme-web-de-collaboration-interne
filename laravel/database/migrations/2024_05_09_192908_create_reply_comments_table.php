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
        Schema::create('reply_comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('comment_id')->nullable()->constrained('comments')->onDelete('cascade'); // Ensure table name is correct
            $table->foreignId('mediacomment_id')->nullable()->constrained('media_comments')->onDelete('cascade'); // Ensure table name is correct
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Ensure table name is correct
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
        Schema::dropIfExists('reply_comments');
    }
};
