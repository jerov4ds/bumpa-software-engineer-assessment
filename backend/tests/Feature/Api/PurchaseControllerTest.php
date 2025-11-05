<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_record_purchase_successfully(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/purchases', [
            'user_id' => $user->id,
            'amount' => 100.00,
            'transaction_id' => 'TXN123456',
            'payment_method' => 'credit_card',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Purchase recorded successfully',
                'data' => [
                    'user_id' => $user->id,
                    'amount' => 100.00,
                    'cashback_amount' => 2.00,
                    'status' => 'completed',
                ],
            ]);
    }

    public function test_record_purchase_with_invalid_user(): void
    {
        $response = $this->postJson('/api/v1/purchases', [
            'user_id' => 9999,
            'amount' => 100.00,
            'transaction_id' => 'TXN123456',
        ]);

        $response->assertStatus(422);
    }

    public function test_record_purchase_with_duplicate_transaction_id(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/v1/purchases', [
            'user_id' => $user->id,
            'amount' => 100.00,
            'transaction_id' => 'TXN123456',
        ]);

        $response = $this->postJson('/api/v1/purchases', [
            'user_id' => $user->id,
            'amount' => 50.00,
            'transaction_id' => 'TXN123456',
        ]);

        $response->assertStatus(422);
    }

    public function test_record_purchase_with_missing_required_fields(): void
    {
        $response = $this->postJson('/api/v1/purchases', [
            'user_id' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount', 'transaction_id']);
    }
}

