<?php

namespace App\Services;

use App\Events\PurchaseCompleted;
use App\Models\Purchase;
use App\Models\User;

class LoyaltyService
{
    /**
     * Record a purchase and trigger loyalty events.
     */
    public function recordPurchase(
        User $user,
        float $amount,
        string $transactionId,
        string $paymentMethod = null,
        string $currency = 'USD'
    ): Purchase {
        // Calculate cashback (2% of purchase amount)
        $cashbackAmount = $amount * 0.02;

        $purchase = Purchase::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'currency' => $currency,
            'status' => 'completed',
            'cashback_amount' => $cashbackAmount,
            'payment_method' => $paymentMethod,
            'transaction_id' => $transactionId,
        ]);

        // Dispatch purchase completed event
        PurchaseCompleted::dispatch($purchase);

        return $purchase;
    }

    /**
     * Get user's loyalty summary.
     */
    public function getUserLoyaltySummary(User $user): array
    {
        $achievements = $user->achievements()->get();
        $badges = $user->badges()->get();
        $totalPurchases = $user->purchases()->where('status', 'completed')->count();
        $totalSpent = $user->purchases()->where('status', 'completed')->sum('amount');
        $totalCashback = $user->purchases()->where('status', 'completed')->sum('cashback_amount');

        return [
            'user_id' => $user->id,
            'total_purchases' => $totalPurchases,
            'total_spent' => (float) $totalSpent,
            'total_cashback' => (float) $totalCashback,
            'achievements_count' => $achievements->count(),
            'achievements' => $achievements->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'description' => $a->description,
                'icon' => $a->icon,
                'points' => $a->points,
                'unlocked_at' => $a->pivot->unlocked_at,
            ]),
            'badges_count' => $badges->count(),
            'current_badge' => $badges->sortByDesc('level')->first()?->name ?? 'None',
            'badges' => $badges->map(fn ($b) => [
                'id' => $b->id,
                'name' => $b->name,
                'description' => $b->description,
                'icon' => $b->icon,
                'level' => $b->level,
                'earned_at' => $b->pivot->earned_at,
            ]),
        ];
    }
}

