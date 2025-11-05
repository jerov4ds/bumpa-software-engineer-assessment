<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 10, 1000);
        $cashback = $amount * 0.02;

        return [
            'user_id' => User::factory(),
            'amount' => $amount,
            'currency' => 'USD',
            'status' => 'completed',
            'cashback_amount' => $cashback,
            'payment_method' => $this->faker->randomElement(['credit_card', 'debit_card', 'bank_transfer']),
            'transaction_id' => $this->faker->unique()->uuid(),
        ];
    }
}

