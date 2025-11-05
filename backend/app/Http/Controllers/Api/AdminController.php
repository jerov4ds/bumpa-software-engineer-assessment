<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get all users with their achievements and badges.
     */
    public function allUsersAchievements(): JsonResponse
    {
        $users = User::with(['achievements', 'badges'])->get()->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'total_achievements' => $user->achievements()->count(),
            'current_badge' => $user->badges()->orderByDesc('level')->first()?->name ?? 'None',
            'badges_count' => $user->badges()->count(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $users,
            'count' => $users->count(),
        ]);
    }

    /**
     * Get specific user's achievements.
     */
    public function userAchievements(string $userId): JsonResponse
    {
        // Try to find user by ID (if it's numeric) or by email
        $user = null;
        if (is_numeric($userId)) {
            $user = User::find((int) $userId);
        }
        if (!$user) {
            $user = User::where('email', $userId)->first();
        }
        if (!$user) {
            abort(404, 'User not found');
        }

        $achievements = $user->achievements()->get()->map(fn ($a) => [
            'id' => $a->id,
            'name' => $a->name,
            'description' => $a->description,
            'icon' => $a->icon,
            'points' => $a->points,
            'type' => $a->type,
            'unlocked_at' => $a->pivot->unlocked_at,
        ]);

        $badges = $user->badges()->get()->map(fn ($b) => [
            'id' => $b->id,
            'name' => $b->name,
            'description' => $b->description,
            'level' => $b->level,
            'earned_at' => $b->pivot->earned_at,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'achievements' => $achievements,
                'badges' => $badges,
            ],
        ]);
    }

    /**
     * List all achievements.
     */
    public function listAchievements(): JsonResponse
    {
        $achievements = Achievement::all();

        return response()->json([
            'success' => true,
            'data' => $achievements,
            'count' => $achievements->count(),
        ]);
    }

    /**
     * Create a new achievement.
     */
    public function createAchievement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'points' => 'required|integer|min:0',
            'type' => 'required|string',
            'criteria' => 'required|array',
        ]);

        $achievement = Achievement::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Achievement created successfully',
            'data' => $achievement,
        ], 201);
    }

    /**
     * List all badges.
     */
    public function listBadges(): JsonResponse
    {
        $badges = Badge::all();

        return response()->json([
            'success' => true,
            'data' => $badges,
            'count' => $badges->count(),
        ]);
    }

    /**
     * Create a new badge.
     */
    public function createBadge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'level' => 'required|integer',
            'required_achievements' => 'required|integer|min:1',
            'required_points' => 'required|integer|min:0',
        ]);

        $badge = Badge::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Badge created successfully',
            'data' => $badge,
        ], 201);
    }
}

