<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Badge>
 */
class BadgeFactory extends Factory
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
            'level' => $this->faker->numberBetween(1, 4),
            'required_achievements' => $this->faker->numberBetween(3, 10),
            'required_points' => $this->faker->numberBetween(50, 500),
        ];
    }
}

