<?php

use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PurchaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/purchases', [PurchaseController::class, 'store']);

    // User routes - use userId parameter instead of implicit model binding
    Route::prefix('users/{userId}')->group(function () {
        Route::get('/achievements', [AchievementController::class, 'userAchievements']);
        Route::get('/summary', [AchievementController::class, 'userSummary']);
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/users/achievements', [AdminController::class, 'allUsersAchievements']);
        Route::get('/users/{userId}/achievements', [AdminController::class, 'userAchievements']);
        Route::get('/achievements', [AdminController::class, 'listAchievements']);
        Route::post('/achievements', [AdminController::class, 'createAchievement']);
        Route::get('/badges', [AdminController::class, 'listBadges']);
        Route::post('/badges', [AdminController::class, 'createBadge']);
    });
});

