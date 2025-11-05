<?php

namespace App\Listeners;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Events\PurchaseCompleted;
use App\Models\Achievement;
use App\Models\Badge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessPurchaseAchievements implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(PurchaseCompleted $event): void
    {
        $purchase = $event->purchase;
        $user = $purchase->user;

        // Check for purchase milestone achievements
        $totalPurchases = $user->purchases()->where('status', 'completed')->count();
        $totalSpent = $user->purchases()->where('status', 'completed')->sum('amount');

        // Check for achievements based on purchase milestones
        $achievements = Achievement::where('type', 'purchase_milestone')->get();

        foreach ($achievements as $achievement) {
            // Skip if user already has this achievement
            if ($user->achievements()->where('achievement_id', $achievement->id)->exists()) {
                continue;
            }

            $criteria = $achievement->criteria;

            // Check if criteria are met
            if ($this->checkCriteria($criteria, $totalPurchases, $totalSpent)) {
                // Unlock achievement
                $user->achievements()->attach($achievement->id, [
                    'unlocked_at' => now(),
                ]);

                // Dispatch achievement unlocked event
                AchievementUnlocked::dispatch($user, $achievement);

                // Check if user qualifies for a badge
                $this->checkAndUnlockBadges($user);
            }
        }
    }

    /**
     * Check if achievement criteria are met.
     */
    private function checkCriteria(array $criteria, int $totalPurchases, float $totalSpent): bool
    {
        if (isset($criteria['min_purchases']) && $totalPurchases < $criteria['min_purchases']) {
            return false;
        }

        if (isset($criteria['min_amount']) && $totalSpent < $criteria['min_amount']) {
            return false;
        }

        return true;
    }

    /**
     * Check and unlock badges for the user.
     */
    private function checkAndUnlockBadges($user): void
    {
        $badges = Badge::all();

        foreach ($badges as $badge) {
            // Skip if user already has this badge
            if ($user->badges()->where('badge_id', $badge->id)->exists()) {
                continue;
            }

            $achievementCount = $user->achievements()->count();
            $totalPoints = $user->achievements()->sum('points');

            // Check if user qualifies for badge
            if ($achievementCount >= $badge->required_achievements &&
                $totalPoints >= $badge->required_points) {
                $user->badges()->attach($badge->id, [
                    'earned_at' => now(),
                ]);

                BadgeUnlocked::dispatch($user, $badge);
            }
        }
    }
}

