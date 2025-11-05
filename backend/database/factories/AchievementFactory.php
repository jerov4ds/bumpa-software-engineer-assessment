<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Achievement>
 */
class AchievementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'icon' => $this->faker->emoji(),
            'points' => $this->faker->numberBetween(5, 50),
            'type' => $this->faker->randomElement(['purchase_milestone', 'referral', 'engagement']),
            'criteria' => [
                'min_purchases' => $this->faker->numberBetween(1, 10),
                'min_amount' => $this->faker->numberBetween(100, 1000),
            ],
        ];
    }
}

