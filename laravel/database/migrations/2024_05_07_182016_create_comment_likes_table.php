<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comment_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comment_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('mediacomment_id')->nullable()->constrained('media_comments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Unique constraints to ensure a user can like a comment or media comment only once
            $table->unique(['user_id', 'comment_id'], 'user_comment_unique');
            $table->unique(['user_id', 'mediacomment_id'], 'user_media_comment_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comment_likes');
    }
};
