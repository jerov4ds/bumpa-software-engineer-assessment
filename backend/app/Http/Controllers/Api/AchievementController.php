<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;

class AchievementController extends Controller
{
    public function __construct(
        private LoyaltyService $loyaltyService,
    ) {}

    /**
     * Get user's achievements.
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

        return response()->json([
            'success' => true,
            'data' => $achievements,
            'count' => $achievements->count(),
        ]);
    }

    /**
     * Get user's loyalty summary.
     */
    public function userSummary(string $userId): JsonResponse
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

        $summary = $this->loyaltyService->getUserLoyaltySummary($user);

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}

