<?php

namespace Tests\Unit\Services;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\Purchase;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyServiceTest extends TestCase
{
    use RefreshDatabase;

    private LoyaltyService $loyaltyService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->loyaltyService = new LoyaltyService();
    }

    public function test_record_purchase_creates_purchase_record(): void
    {
        $user = User::factory()->create();

        $purchase = $this->loyaltyService->recordPurchase(
            $user,
            100.00,
            'TXN123456',
            'credit_card'
        );

        $this->assertInstanceOf(Purchase::class, $purchase);
        $this->assertEquals($user->id, $purchase->user_id);
        $this->assertEquals(100.00, $purchase->amount);
        $this->assertEquals(2.00, $purchase->cashback_amount); // 2% cashback
        $this->assertEquals('completed', $purchase->status);
    }

    public function test_record_purchase_calculates_cashback_correctly(): void
    {
        $user = User::factory()->create();

        $purchase = $this->loyaltyService->recordPurchase(
            $user,
            50.00,
            'TXN789012'
        );

        $this->assertEquals(1.00, $purchase->cashback_amount); // 2% of 50
    }

    public function test_get_user_loyalty_summary_returns_correct_data(): void
    {
        $user = User::factory()->create();
        
        // Create achievements
        $achievement = Achievement::factory()->create([
            'points' => 10,
        ]);
        
        $user->achievements()->attach($achievement->id, [
            'unlocked_at' => now(),
        ]);

        // Create badge
        $badge = Badge::factory()->create();
        $user->badges()->attach($badge->id, [
            'earned_at' => now(),
        ]);

        // Create purchases
        Purchase::factory()->create([
            'user_id' => $user->id,
            'amount' => 100.00,
            'status' => 'completed',
            'cashback_amount' => 2.00,
        ]);

        $summary = $this->loyaltyService->getUserLoyaltySummary($user);

        $this->assertEquals($user->id, $summary['user_id']);
        $this->assertEquals(1, $summary['total_purchases']);
        $this->assertEquals(100.00, $summary['total_spent']);
        $this->assertEquals(2.00, $summary['total_cashback']);
        $this->assertEquals(1, $summary['achievements_count']);
        $this->assertEquals(1, $summary['badges_count']);
    }

    public function test_get_user_loyalty_summary_with_no_achievements(): void
    {
        $user = User::factory()->create();

        $summary = $this->loyaltyService->getUserLoyaltySummary($user);

        $this->assertEquals(0, $summary['achievements_count']);
        $this->assertEquals('None', $summary['current_badge']);
    }
}

